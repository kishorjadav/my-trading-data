<script>
  import { onMount, onDestroy } from "svelte";

  const SHEET_ID = "1pYFPQVgCiLy6sNQAVaiHsIlsWDYfEMt__lb_nkblm_I";
  const TAB_NAME = "FF_Events";
  const AUTO_REFRESH_MS = 60000;

  function getTodayIstIso() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value || "";
    return `${get("year")}-${get("month")}-${get("day")}`;
  }

  let events = [];
  let selectedDate = getTodayIstIso();
  let selectedCurrency = "ALL";
  let selectedImpact = "ALL";
  let searchQuery = "";
  let expandedId = null;
  let copiedId = null;

  let isMobile = false;
  let isLoading = false;
  let hasLoadedOnce = false;
  let errorMsg = "";
  let lastUpdated = "";
  let nowTick = Date.now();

  let pollTimer = null;
  let clockTimer = null;

  function updateViewport() {
    if (typeof window !== "undefined") {
      isMobile = window.innerWidth < 640;
    }
  }

  function parseCsvRow(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  function formatDisplayDate(rawDate, mobile) {
    if (!rawDate) return "";
    const match = String(rawDate).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return String(rawDate).trim();
    const [, yyyy, mm, dd] = match;
    return mobile ? `${dd}-${mm}-${yyyy.slice(2)}` : `${dd}-${mm}-${yyyy}`;
  }

  function getWeekdayShort(rawDate) {
    const match = String(rawDate || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return "";
    const dt = new Date(`${rawDate}T00:00:00+05:30`);
    if (isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short"
    });
  }

  function normalizeImpact(raw) {
    const val = String(raw || "").trim().toLowerCase();
    if (val === "high" || val === "red") return "High";
    if (val === "medium" || val === "orange") return "Medium";
    return String(raw || "").trim();
  }

  function parseEventTimestampMs(dateIso, timeIst) {
    if (!dateIso || !timeIst) return null;
    const m = String(timeIst).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    let hh = Number(m[1]);
    const mm = Number(m[2]);
    const ap = m[3].toUpperCase();
    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;
    const hhStr = String(hh).padStart(2, "0");
    const mmStr = String(mm).padStart(2, "0");
    const dt = new Date(`${dateIso}T${hhStr}:${mmStr}:00+05:30`);
    return isNaN(dt.getTime()) ? null : dt.getTime();
  }

  function getEventTimingMeta(ev, currentMs) {
    const targetMs = parseEventTimestampMs(ev.date, ev.timeIst);
    if (!targetMs) {
      return {
        state: ev.actual ? "released" : "scheduled",
        label: ev.actual ? "RELEASED" : "SCHEDULED",
        diffMs: Infinity
      };
    }

    const diffMs = targetMs - currentMs;
    if (ev.actual) {
      return { state: "released", label: "RELEASED", diffMs };
    }
    if (diffMs <= 0 && diffMs >= -15 * 60 * 1000) {
      return { state: "live", label: "RELEASING NOW", diffMs };
    }
    if (diffMs < -15 * 60 * 1000) {
      return { state: "pending", label: "AWAITING ACTUAL", diffMs };
    }

    const totalMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const countdown = hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`;
    return { state: "upcoming", label: countdown, diffMs };
  }

  function getTradingSession(timeIst) {
    const m = String(timeIst || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return "Global Session";
    let hh = Number(m[1]);
    const ap = m[3].toUpperCase();
    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;

    if (hh >= 5 && hh < 12) return "Asia / Tokyo Session";
    if (hh >= 12 && hh < 17) return "London Open Session";
    if (hh >= 17 && hh < 23) return "NY / London Overlap";
    return "Late US Session";
  }

  function handleDatePickerInput(e) {
    const val = e.currentTarget.value;
    selectedDate = val || "ALL";
  }

  function toggleExpand(id) {
    expandedId = expandedId === id ? null : id;
  }

  async function copyEventSummary(e, ev) {
    e.stopPropagation();
    const text = `[${formatDisplayDate(ev.date, false)} ${ev.timeIst} IST] ${ev.currency} (${ev.impact}) — ${ev.event} | Actual: ${ev.actual || "Pending"} | Forecast: ${ev.forecast || "—"} | Previous: ${ev.previous || "—"}`;
    try {
      await navigator.clipboard.writeText(text);
      copiedId = ev.id;
      setTimeout(() => {
        if (copiedId === ev.id) copiedId = null;
      }, 1600);
    } catch (_) {}
  }

  async function fetchForexEvents({ silent = false } = {}) {
    if (!silent || !hasLoadedOnce) {
      isLoading = true;
    }
    errorMsg = "";

    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TAB_NAME)}&_t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const csvText = await res.text();
      const lines = csvText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length <= 1) {
        events = [];
        hasLoadedOnce = true;
        return;
      }

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvRow(lines[i]);
        const impact = normalizeImpact(cols[3]);
        if (impact !== "High" && impact !== "Medium") continue;

        const date = cols[0] || "";
        const timeIst = cols[1] || "";
        const currency = (cols[2] || "").toUpperCase();
        const event = cols[4] || "";

        parsed.push({
          id: `${date}_${timeIst}_${currency}_${event}_${i}`,
          date,
          timeIst,
          currency,
          impact,
          event,
          actual: cols[5] || "",
          forecast: cols[6] || "",
          previous: cols[7] || ""
        });
      }

      events = parsed;
      hasLoadedOnce = true;
      lastUpdated = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    } catch (err) {
      if (!hasLoadedOnce) {
        errorMsg = `Failed to load ${TAB_NAME}: ${err.message}`;
      }
    } finally {
      isLoading = false;
    }
  }

  $: todayIso = getTodayIstIso();
  $: availableDates = [...new Set(events.map((e) => e.date).filter(Boolean))];
  $: availableCurrencies = [...new Set(events.map((e) => e.currency).filter(Boolean))].sort();

  $: dateFilteredEvents = events.filter((e) =>
    selectedDate === "ALL" ? true : e.date === selectedDate
  );

  $: currencyCounts = availableCurrencies.reduce((acc, curr) => {
    acc[curr] = dateFilteredEvents.filter((e) => e.currency === curr).length;
    return acc;
  }, {});

  $: filteredEvents = dateFilteredEvents.filter((e) => {
    if (selectedCurrency !== "ALL" && e.currency !== selectedCurrency) return false;
    if (selectedImpact !== "ALL" && e.impact !== selectedImpact) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const hay = `${e.event} ${e.currency} ${e.impact}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  $: nextUpcomingEvent =
    filteredEvents
      .map((ev) => ({ ev, meta: getEventTimingMeta(ev, nowTick) }))
      .filter((item) => item.meta.state === "upcoming" || item.meta.state === "live")
      .sort((a, b) => a.meta.diffMs - b.meta.diffMs)[0] || null;

  $: liveIstClock = new Date(nowTick).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  onMount(() => {
    updateViewport();
    window.addEventListener("resize", updateViewport);
    fetchForexEvents({ silent: false });

    clockTimer = setInterval(() => {
      nowTick = Date.now();
    }, 1000);

    if (AUTO_REFRESH_MS > 0) {
      pollTimer = setInterval(() => {
        fetchForexEvents({ silent: true });
      }, AUTO_REFRESH_MS);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateViewport);
    }
    if (pollTimer) clearInterval(pollTimer);
    if (clockTimer) clearInterval(clockTimer);
  });
</script>

<svelte:head>
  <title>Economic Catalyst Radar — {formatDisplayDate(selectedDate, false) || "All Dates"}</title>
</svelte:head>

<main class="relative  w-full overflow-x-hidden  text-zinc-100 antialiased selection:bg-emerald-500/25 selection:text-emerald-200">
  <!-- Subtle Ambient Backdrop Glows -->
  <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
    <div class="absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl"></div>
    <div class="absolute top-1/3 right-[-8rem] h-72 w-72 rounded-full bg-amber-500/[0.05] blur-3xl"></div>
    <div class="absolute bottom-[-6rem] left-[-6rem] h-72 w-72 rounded-full bg-rose-500/[0.05] blur-3xl"></div>
  </div>

  <div class="relative mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
    <section class="rounded-2xl border border-white/[0.08] bg-[#11151d]/90 p-4  shadow-black/50 backdrop-blur-xl sm:p-6">
      <!-- Header & Live Clock -->
      <header class="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div class="mb-1 flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            <span class="text-[11px] font-semibold tracking-[0.12em] text-emerald-400/90 uppercase">
              Macro Catalyst Feed • IST
            </span>
          </div>
          <h1 class="text-lg font-bold tracking-tight text-white sm:text-xl">
            News Calendar
          </h1>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-900/90 px-3 py-1.5 text-xs">
            <span class="font-bold tracking-wider text-emerald-400">IST</span>
            <span class="font-semibold tabular-nums text-zinc-200">{liveIstClock}</span>
          </div>

          {#if lastUpdated}
            <span class="text-xs text-zinc-400">Synced {lastUpdated}</span>
          {/if}

          {#if !isMobile}
            <button
              type="button"
              on:click={() => fetchForexEvents({ silent: false })}
              disabled={isLoading}
              class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span class={isLoading ? "inline-block animate-spin" : "inline-block"}>↻</span>
              {isLoading ? "Syncing..." : "Refresh"}
            </button>
          {/if}
        </div>
      </header>

      <!-- Next Catalyst Banner -->
      {#if nextUpcomingEvent}
        <div
          class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-xs sm:text-sm {nextUpcomingEvent.ev.impact === 'High'
            ? 'border-rose-500/30 bg-gradient-to-r from-rose-500/[0.11] via-zinc-900/80 to-zinc-900/80'
            : 'border-amber-500/30 bg-gradient-to-r from-amber-500/[0.10] via-zinc-900/80 to-zinc-900/80'}"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold tracking-wider text-zinc-200 uppercase">
              Next Up
            </span>
            <span class="font-bold text-white">{nextUpcomingEvent.ev.currency}</span>
            <span class="text-zinc-600">•</span>
            <span class="font-medium text-zinc-200">{nextUpcomingEvent.ev.event}</span>
          </div>

          <div class="flex items-center gap-2.5">
            <span class="tabular-nums text-xs text-zinc-400">{nextUpcomingEvent.ev.timeIst} IST</span>
            <span class="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold tabular-nums text-emerald-300">
              {nextUpcomingEvent.meta.label}
            </span>
          </div>
        </div>
      {/if}

      <!-- Date Picker + One-Tap Date Strip -->
      <div class="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div class="flex shrink-0 items-center gap-2">
          <label class="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300 focus-within:border-emerald-400/50">
            <span class="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">Date</span>
            <input
              type="date"
              value={selectedDate === "ALL" ? "" : selectedDate}
              on:input={handleDatePickerInput}
              aria-label="Pick a specific date"
              class="cursor-pointer bg-transparent text-xs font-semibold tabular-nums text-zinc-100 focus:outline-none [color-scheme:dark]"
            />
          </label>

          <!-- {#if selectedDate !== "ALL"}
            <button
              type="button"
              on:click={() => (selectedDate = "ALL")}
              class="cursor-pointer rounded-lg border border-white/[0.08] bg-zinc-900/80 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              All Dates
            </button>
          {/if} -->
        </div>

        <div class="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Quick Dates">
          <!-- <button
            type="button"
            on:click={() => (selectedDate = "ALL")}
            class="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-left transition {selectedDate === 'ALL'
              ? 'border-emerald-400/50 bg-emerald-500/15 text-white shadow-sm shadow-emerald-500/10'
              : 'border-white/[0.07] bg-zinc-900/75 text-zinc-400 hover:border-white/15 hover:text-zinc-200'}"
          >
            <span class="text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">ALL</span>
            <span class="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-zinc-300">
              {events.length}
            </span>
          </button> -->

          {#each availableDates as d}
            {@const count = events.filter((e) => e.date === d).length}
            <button
              type="button"
              on:click={() => (selectedDate = d)}
              class="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-left transition {selectedDate === d
                ? 'border-emerald-400/50 bg-emerald-500/15 text-white shadow-sm shadow-emerald-500/10'
                : 'border-white/[0.07] bg-zinc-900/75 text-zinc-400 hover:border-white/15 hover:text-zinc-200'}"
            >
              <span class="text-[10px] font-extrabold tracking-wider uppercase {d === todayIso ? 'text-emerald-400' : 'text-zinc-400'}">
                {d === todayIso ? "TODAY" : getWeekdayShort(d)}
              </span>
              <span class="text-xs font-semibold tabular-nums">{formatDisplayDate(d, isMobile)}</span>
              <span class="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-zinc-300">
                {count}
              </span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Filter Controls: Impact Switch + Currency Chips + Search -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Impact Toggle -->
          <div class="inline-flex rounded-xl border border-white/[0.07] bg-zinc-900/90 p-1" role="group" aria-label="Filter by Impact">
            <button
              type="button"
              on:click={() => (selectedImpact = "ALL")}
              class="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition {selectedImpact === 'ALL'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'}"
            >
              All
            </button>
            <button
              type="button"
              on:click={() => (selectedImpact = "High")}
              class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition {selectedImpact === 'High'
                ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                : 'text-zinc-400 hover:text-zinc-200'}"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
              High
            </button>
            <button
              type="button"
              on:click={() => (selectedImpact = "Medium")}
              class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition {selectedImpact === 'Medium'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200'}"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              Medium
            </button>
          </div>

          <!-- Currency Chips -->
          <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by Currency">
            <button
              type="button"
              on:click={() => (selectedCurrency = "ALL")}
              class="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition {selectedCurrency === 'ALL'
                ? 'border-emerald-400/45 bg-emerald-500/15 text-emerald-200'
                : 'border-white/[0.07] bg-zinc-900/75 text-zinc-400 hover:border-white/15 hover:text-zinc-200'}"
            >
              All ({dateFilteredEvents.length})
            </button>
            <!-- {#each availableCurrencies as c}
              <button
                type="button"
                on:click={() => (selectedCurrency = c)}
                class="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition {selectedCurrency === c
                  ? 'border-emerald-400/45 bg-emerald-500/15 text-emerald-200'
                  : 'border-white/[0.07] bg-zinc-900/75 text-zinc-400 hover:border-white/15 hover:text-zinc-200'}"
              >
                {c} <span class="ml-0.5 text-[10px] opacity-70">{currencyCounts[c] || 0}</span>
              </button>
            {/each} -->
          </div>
        </div>

        <!-- Search Input -->
        <!-- <div class="w-full sm:w-60">
          <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search CPI, PMI, GDP..."
            aria-label="Search events"
            class="w-full rounded-xl border border-white/[0.08] bg-zinc-900/90 px-3.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 transition focus:border-emerald-400/50 focus:outline-none"
          />
        </div> -->
      </div>

      <!-- Timeline Feed (Card-Based, No Table) -->
      {#if errorMsg}
        <div class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-300">
          {errorMsg}
        </div>
      {:else if isLoading && !hasLoadedOnce}
        <div class="rounded-xl border border-dashed border-white/10 bg-zinc-900/50 p-8 text-center text-sm text-zinc-400">
          Loading economic calendar events...
        </div>
      {:else if filteredEvents.length === 0}
        <div class="rounded-xl border border-dashed border-white/10 bg-zinc-900/50 p-8 text-center text-sm text-zinc-400">
          No High or Medium impact events for
          <span class="font-semibold text-zinc-200">
            {selectedDate === "ALL" ? "selected filters" : formatDisplayDate(selectedDate, isMobile)}
          </span>.
        </div>
      {:else}
        <div class="max-h-[34rem] space-y-2.5 overflow-y-auto pr-1">
          {#each filteredEvents as ev, idx (ev.id)}
            {@const timing = getEventTimingMeta(ev, nowTick)}
            {@const isExpanded = expandedId === ev.id}
            {@const showSessionDivider =
              idx === 0 ||
              getTradingSession(filteredEvents[idx - 1].timeIst) !== getTradingSession(ev.timeIst) ||
              filteredEvents[idx - 1].date !== ev.date}

            {#if showSessionDivider}
              <div class="flex items-center gap-3 pt-2 pb-1">
                <span class="text-[10px] font-bold tracking-[0.1em] text-zinc-500 uppercase">
                  {#if selectedDate === "ALL"}
                    {formatDisplayDate(ev.date, isMobile)} •
                  {/if}
                  {getTradingSession(ev.timeIst)}
                </span>
                <div class="h-px flex-1 bg-white/[0.06]"></div>
              </div>
            {/if}

            <article
              on:click={() => toggleExpand(ev.id)}
              on:keydown={(e) => (e.key === "Enter" || e.key === " ") && toggleExpand(ev.id)}
              role="button"
              tabindex="0"
              aria-expanded={isExpanded}
              class="group cursor-pointer rounded-xl border border-white/[0.07] bg-zinc-900/75 p-3.5 transition hover:border-white/[0.15] hover:bg-zinc-900 {ev.impact === 'High'
                ? 'border-l-4 border-l-rose-500'
                : 'border-l-4 border-l-amber-400'}"
            >
              <div class="flex flex-col gap-3 sm:grid sm:grid-cols-[124px_1fr_20px] sm:items-center sm:gap-4">
                <!-- Left Time & Status Column -->
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-2 sm:flex-col sm:items-start sm:justify-center sm:gap-1.5 sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0">
                  <div>
                    <div class="text-sm font-bold tabular-nums text-white">
                      {ev.timeIst || "All Day"}
                    </div>
                    {#if selectedDate === "ALL"}
                      <div class="text-[11px] tabular-nums text-zinc-400">
                        {formatDisplayDate(ev.date, isMobile)}
                      </div>
                    {/if}
                  </div>

                  <span
                    class="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase {timing.state === 'live'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : timing.state === 'upcoming'
                        ? 'bg-sky-500/15 text-sky-300'
                        : timing.state === 'released'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/[0.06] text-zinc-400'}"
                  >
                    {timing.label}
                  </span>
                </div>

                <!-- Center Event Details & Figures -->
                <div class="min-w-0 space-y-2.5">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-md bg-white/[0.08] px-2 py-0.5 text-xs font-extrabold tracking-wide text-white">
                      {ev.currency}
                    </span>
                    <span
                      class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold {ev.impact === 'High'
                        ? 'border border-rose-500/30 bg-rose-500/15 text-rose-300'
                        : 'border border-amber-500/30 bg-amber-500/15 text-amber-300'}"
                    >
                      {ev.impact}
                    </span>
                    <h2 class="text-sm font-semibold text-zinc-100">
                      {ev.event}
                    </h2>
                  </div>

                  <div class="grid grid-cols-3 gap-2">
                    <div
                      class="rounded-lg border px-2.5 py-1.5 {ev.actual
                        ? 'border-emerald-400/30 bg-emerald-500/[0.08]'
                        : 'border-white/[0.06] bg-black/30'}"
                    >
                      <div class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Actual</div>
                      <div class="mt-0.5 text-xs font-bold tabular-nums {ev.actual ? 'text-emerald-300' : 'text-zinc-400'}">
                        {ev.actual || "—"}
                      </div>
                    </div>

                    <div class="rounded-lg border border-white/[0.06] bg-black/30 px-2.5 py-1.5">
                      <div class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Forecast</div>
                      <div class="mt-0.5 text-xs font-semibold tabular-nums text-zinc-200">
                        {ev.forecast || "—"}
                      </div>
                    </div>

                    <div class="rounded-lg border border-white/[0.06] bg-black/30 px-2.5 py-1.5">
                      <div class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Previous</div>
                      <div class="mt-0.5 text-xs font-semibold tabular-nums text-zinc-300">
                        {ev.previous || "—"}
                      </div>
                    </div>
                  </div>

                  {#if isExpanded}
                    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-white/10 pt-2.5 text-xs text-zinc-400">
                      <div class="flex flex-wrap gap-x-4 gap-y-1">
                        <span>Date: <strong class="text-zinc-200">{formatDisplayDate(ev.date, false)}</strong></span>
                        <span>Session: <strong class="text-zinc-200">{getTradingSession(ev.timeIst)}</strong></span>
                      </div>
                      <button
                        type="button"
                        on:click={(e) => copyEventSummary(e, ev)}
                        class="cursor-pointer rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                      >
                        {copiedId === ev.id ? "✓ Copied" : "Copy Brief"}
                      </button>
                    </div>
                  {/if}
                </div>

                <!-- Right Expand Indicator -->
                <div class="hidden text-right text-xs text-zinc-500 transition group-hover:text-zinc-300 sm:block">
                  {isExpanded ? "▲" : "▼"}
                </div>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </section>
  </div>
</main>