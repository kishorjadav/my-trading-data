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

  let isMobile = false;
  let isLoading = false;
  let hasLoadedOnce = false;
  let errorMsg = "";
  let lastUpdated = "";
  let pollTimer = null;

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

  function handleDatePickerInput(e) {
    const val = e.currentTarget.value;
    selectedDate = val || "ALL";
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

        parsed.push({
          date: cols[0] || "",
          timeIst: cols[1] || "",
          currency: (cols[2] || "").toUpperCase(),
          impact,
          event: cols[4] || "",
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

  $: filteredEvents = events.filter((e) => {
    if (selectedDate !== "ALL" && e.date !== selectedDate) return false;
    if (selectedCurrency !== "ALL" && e.currency !== selectedCurrency) return false;
    if (selectedImpact !== "ALL" && e.impact !== selectedImpact) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const hay = `${e.event} ${e.currency} ${e.impact}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  onMount(() => {
    updateViewport();
    window.addEventListener("resize", updateViewport);
    fetchForexEvents({ silent: false });

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
    if (pollTimer) {
      clearInterval(pollTimer);
    }
  });
</script>

<svelte:head>
  <title>Forex Factory Calendar — {formatDisplayDate(selectedDate, false) || "All Dates"}</title>
</svelte:head>

<div class="min-h-screen bg-[#27272a] py-6 text-zinc-100 sm:py-8">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="rounded-xl border border-zinc-700 bg-[#27272a] p-4 shadow-lg sm:p-6 lg:p-8">
      <!-- Header Section -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="text-base font-semibold text-white sm:text-lg">
              My News Calendar
            </h1>
            {#if lastUpdated}
              <span class="rounded-full border border-zinc-600 bg-zinc-900/70 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                Synced {lastUpdated} IST
              </span>
            {/if}
          </div>
          <p class="mt-1.5 text-sm text-zinc-300">
            High and medium impact economic events in IST with live Actual, Forecast, and Previous figures.
          </p>
        </div>

        <div class="mt-4 flex items-center gap-2 sm:mt-0 sm:ml-6 sm:flex-none">
        
          <!-- <button
            type="button"
            on:click={() => fetchForexEvents({ silent: false })}
            disabled={isLoading}
            class="block w-full cursor-pointer rounded-md bg-indigo-500 px-3.5 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
          
            {isLoading ? "Refreshing..." : "Refresh"}
          </button> -->

          <button
          type="button"
          on:click={() => fetchForexEvents({ silent: false })}
          disabled={isLoading}
          title="Refresh Now"
          aria-label="Refresh Now"
          class="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-200 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-500/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5 {isLoading ? 'animate-spin text-indigo-300' : ''}"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>
        </div>
      </div>

      <!-- Date Picker + Quick Date Pills -->
      <div class="mt-6 flex flex-col gap-3 border-t border-zinc-700 pt-4 sm:flex-row sm:items-center">
        <div class="flex items-center gap-2">
          <label class="inline-flex flex-1 items-center gap-2 rounded-md border border-zinc-600 bg-zinc-900/75 px-3 py-1.5 text-sm text-zinc-200 shadow-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 sm:flex-initial">
            <span class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Date</span>
            <input
              type="date"
              value={selectedDate === "ALL" ? "" : selectedDate}
              on:input={handleDatePickerInput}
              aria-label="Pick a specific date"
              class="w-full cursor-pointer bg-transparent text-sm font-medium text-white focus:outline-none [color-scheme:dark] sm:w-auto"
            />
          </label>

          <!-- {#if selectedDate !== "ALL"}
            <button
              type="button"
              on:click={() => (selectedDate = "ALL")}
              class="cursor-pointer rounded-md border border-zinc-600 bg-zinc-900/75 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 shadow-sm transition hover:bg-zinc-900"
            >
              All Dates
            </button>
          {/if} -->
        </div>

        <div class="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {#each availableDates as d}
            <button
              type="button"
              on:click={() => (selectedDate = d)}
              class="shrink-0 cursor-pointer rounded-md border px-2.5 py-1.5 text-xs font-medium transition {selectedDate === d
                ? 'border-indigo-400 bg-indigo-500/20 font-semibold text-indigo-200'
                : 'border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500 hover:text-white'}"
            >
              <span class="mr-1 font-semibold uppercase {d === todayIso ? 'text-indigo-300' : 'text-zinc-400'}">
                {d === todayIso ? "Today" : getWeekdayShort(d)}
              </span>
              <span>{formatDisplayDate(d, isMobile)}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Filter Bar: Currency, Impact, Search -->
      <!-- <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label for="currency-filter" class="block text-xs font-medium text-zinc-300">
            Currency
          </label>
          <select
            id="currency-filter"
            bind:value={selectedCurrency}
            class="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-900/75 px-3 py-2 text-sm text-white shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="ALL">All Currencies</option>
            {#each availableCurrencies as c}
              <option value={c}>{c}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="impact-filter" class="block text-xs font-medium text-zinc-300">
            Impact
          </label>
          <select
            id="impact-filter"
            bind:value={selectedImpact}
            class="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-900/75 px-3 py-2 text-sm text-white shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="ALL">All Impact</option>
            <option value="High">High (Red)</option>
            <option value="Medium">Medium (Orange)</option>
          </select>
        </div>

        <div>
          <label for="event-search" class="block text-xs font-medium text-zinc-300">
            Search Event
          </label>
          <input
            id="event-search"
            type="search"
            bind:value={searchQuery}
            placeholder="CPI, PMI, GDP, Speeches..."
            class="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-900/75 px-3 py-2 text-sm text-white placeholder-zinc-400 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
          />
        </div>
      </div> -->

      <!-- Content Area -->
      {#if errorMsg}
        <div class="mt-6 rounded-md border border-red-500/40 bg-red-950/50 p-4 text-sm text-red-200">
          {errorMsg}
        </div>
      {:else if isLoading && !hasLoadedOnce}
        <div class="mt-6 rounded-md border border-zinc-700 bg-zinc-900/60 p-8 text-center text-sm text-zinc-300">
          Loading economic calendar events...
        </div>
      {:else if filteredEvents.length === 0}
        <div class="mt-6 rounded-md border border-zinc-700 bg-zinc-900/60 p-8 text-center text-sm text-zinc-300">
          No High or Medium impact events found for
          <span class="font-semibold text-white">
            {selectedDate === "ALL" ? "the current filters" : formatDisplayDate(selectedDate, isMobile)}
          </span>.
        </div>
      {:else}
        <!-- Mobile Stacked Cards (< sm) -->
        <div class="mt-6 space-y-3 sm:hidden">
          {#each filteredEvents as row}
            <div class="rounded-lg border border-zinc-700 bg-zinc-900/65 p-4">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-sm font-semibold text-white">{row.currency}</span>
                    <span class="text-xs text-zinc-400">
                      {formatDisplayDate(row.date, true)} • {row.timeIst}
                    </span>
                  </div>
                  <p class="mt-1 text-sm font-medium text-zinc-100">{row.event}</p>
                </div>

                <span
                  class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold {row.impact === 'High'
                    ? 'bg-red-500/15 text-red-300 ring-1 ring-red-400/35'
                    : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/35'}"
                >
                  {row.impact}
                </span>
              </div>

              <dl class="mt-3 grid grid-cols-3 divide-x divide-zinc-700 rounded-md border border-zinc-700 bg-[#27272a] text-center">
                <div class="px-2 py-2">
                  <dt class="text-[11px] font-medium text-zinc-400">Actual</dt>
                  <dd class="mt-0.5 text-xs font-semibold {row.actual ? 'text-indigo-300' : 'text-zinc-500'}">
                    {row.actual || "—"}
                  </dd>
                </div>
                <div class="px-2 py-2">
                  <dt class="text-[11px] font-medium text-zinc-400">Forecast</dt>
                  <dd class="mt-0.5 text-xs font-medium text-zinc-100">
                    {row.forecast || "—"}
                  </dd>
                </div>
                <div class="px-2 py-2">
                  <dt class="text-[11px] font-medium text-zinc-400">Previous</dt>
                  <dd class="mt-0.5 text-xs font-medium text-zinc-300">
                    {row.previous || "—"}
                  </dd>
                </div>
              </dl>
            </div>
          {/each}
        </div>

        <!-- Desktop / Tablet Bordered Grid Table (>= sm) -->
        <div class="mt-6 hidden flow-root sm:block">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden rounded-lg border border-zinc-700">
                <table class="min-w-full divide-y divide-zinc-700 bg-[#27272a]">
                  <thead>
                    <tr class="divide-x divide-zinc-700 bg-zinc-900/70">
                      <th scope="col" class="py-3.5 pr-4 pl-4 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:pl-4">
                        Date
                      </th>
                      <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase">
                        Time (IST)
                      </th>
                      <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase">
                        Currency
                      </th>
                      <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase">
                        Impact
                      </th>
                      <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase">
                        Event
                      </th>
                      <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase">
                        Actual
                      </th>
                      <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase">
                        Forecast
                      </th>
                      <th scope="col" class="py-3.5 pr-4 pl-4 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:pr-4">
                        Previous
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-zinc-700 bg-[#27272a]">
                    {#each filteredEvents as row}
                      <tr class="divide-x divide-zinc-700 transition hover:bg-zinc-900/45">
                        <td class="py-3.5 pr-4 pl-4 text-sm font-medium whitespace-nowrap text-zinc-100 sm:pl-4">
                          {formatDisplayDate(row.date, isMobile)}
                        </td>
                        <td class="p-3.5 text-sm whitespace-nowrap text-zinc-300">
                          {row.timeIst}
                        </td>
                        <td class="p-3.5 text-sm font-semibold whitespace-nowrap text-white">
                          {row.currency}
                        </td>
                        <td class="p-3.5 text-sm whitespace-nowrap">
                          <span
                            class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold {row.impact === 'High'
                              ? 'bg-red-500/15 text-red-300 ring-1 ring-red-400/35'
                              : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/35'}"
                          >
                            {row.impact}
                          </span>
                        </td>
                        <td class="p-3.5 text-sm font-medium text-zinc-100">
                          {row.event}
                        </td>
                        <td class="p-3.5 text-sm font-semibold whitespace-nowrap {row.actual ? 'text-indigo-300' : 'text-zinc-500'}">
                          {row.actual || "—"}
                        </td>
                        <td class="p-3.5 text-sm whitespace-nowrap text-zinc-200">
                          {row.forecast || "—"}
                        </td>
                        <td class="py-3.5 pr-4 pl-4 text-sm whitespace-nowrap text-zinc-300 sm:pr-4">
                          {row.previous || "—"}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>