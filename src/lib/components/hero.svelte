<script>
  import { onMount, onDestroy } from "svelte";

  const SHEET_ID = "1pYFPQVgCiLy6sNQAVaiHsIlsWDYfEMt__lb_nkblm_I";
  const PAGE_SIZE = 20;
  const AUTO_REFRESH_MS = 60000; // Check for new Google Sheet rows every 60 seconds

  // Target times in minutes from midnight (IST)
  // 5:30am (330), 6:30am (390), 10:30am (630), 2:30pm (870), 5:30pm (1050), 9:30pm (1290)
  const TARGET_MINUTES = [
    5 * 60 + 30,
    6 * 60 + 30,
    10 * 60 + 30,
    14 * 60 + 30,
    17 * 60 + 30,
    21 * 60 + 30
  ];
  const MAX_TIME_DIFF_MINUTES = 20;

  const MONTHS = [
    { value: "Nov_2026", label: "Nov 2026" },
    { value: "Dec_2026", label: "Dec 2026" },
    { value: "Jan_2027", label: "Jan 2027" }
  ];

  const MONTH_NAME_TO_NUM = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12"
  };

  let selectedCoin = "XAUT";
  let selectedMonth = getCurrentMonthSuffixIST();
  let selectedDate = getTodayIST(); // Defaults to today's date in IST (YYYY-MM-DD)
  let currentPage = 1;
  let allFilteredRows = [];
  let highlightedKeys = new Set();
  let rows = [];
  let loading = true;
  let error = "";
  let lastSyncedAt = "";
  let pollTimer = null;

  function getTodayIST() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(now);

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    return `${year}-${month}-${day}`;
  }

  function getCurrentMonthSuffixIST() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      month: "short",
      year: "numeric"
    }).formatToParts(now);

    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    return `${month}_${year}`;
  }

  function getMonthSuffixFromIsoDate(dateIso) {
    if (!dateIso || !/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
      return getCurrentMonthSuffixIST();
    }
    const [y, m, d] = dateIso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      year: "numeric"
    }).formatToParts(dt);

    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    return `${month}_${year}`;
  }

  // Converts "Dec_2026" -> "2026-12"
  function monthSuffixToYearMonth(monthSuffix) {
    const match = String(monthSuffix || "").match(/^([A-Za-z]{3})_(\d{4})$/);
    if (!match) return "";
    const monthNum = MONTH_NAME_TO_NUM[match[1]];
    if (!monthNum) return "";
    return `${match[2]}-${monthNum}`;
  }

  function hasValidCallsAndPuts(callsStr, putsStr) {
    const cleanCalls = String(callsStr ?? "").replace(/[,$]/g, "").trim();
    const cleanPuts = String(putsStr ?? "").replace(/[,$]/g, "").trim();
    if (!cleanCalls || !cleanPuts) return false;
    return Number.isFinite(Number(cleanCalls)) && Number.isFinite(Number(cleanPuts));
  }

  function formatSyncTime12Hr(dateObj = new Date()) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(dateObj);
  }

  function parseCsvLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  function parseTimestampToDate(rawStr) {
    if (!rawStr) return null;
    const cleaned = String(rawStr)
      .replace(/^"|"$/g, "")
      .replace(/\.\d+$/, "")
      .trim();
    if (!cleaned) return null;

    const isoMatch = cleaned.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?/
    );
    if (isoMatch) {
      return new Date(
        Number(isoMatch[1]),
        Number(isoMatch[2]) - 1,
        Number(isoMatch[3]),
        Number(isoMatch[4]),
        Number(isoMatch[5]),
        Number(isoMatch[6] || 0)
      );
    }

    const usMatch = cleaned.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/
    );
    if (usMatch) {
      return new Date(
        Number(usMatch[3]),
        Number(usMatch[1]) - 1,
        Number(usMatch[2]),
        Number(usMatch[4]),
        Number(usMatch[5]),
        Number(usMatch[6] || 0)
      );
    }

    const fallback = new Date(cleaned);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  function toIsoDateKey(dt) {
    if (!dt) return "";
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function getMinutesFromMidnight(dt) {
    if (!dt) return null;
    return dt.getHours() * 60 + dt.getMinutes() + dt.getSeconds() / 60;
  }

  // Returns { dateFull: "dd-mm-yyyy", dateShort: "dd-mm-yy", timeFormatted: "hh:mm AM/PM" }
  function splitDateAndTime12Hr(rawStr) {
    const dt = parseTimestampToDate(rawStr);
    if (!dt) {
      return {
        dateFull: rawStr || "",
        dateShort: rawStr || "",
        timeFormatted: ""
      };
    }

    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = String(dt.getFullYear());
    const yy = yyyy.slice(-2);

    const hours24 = dt.getHours();
    const ampm = hours24 >= 12 ? "PM" : "AM";
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12;

    const hh = String(hours12).padStart(2, "0");
    const min = String(dt.getMinutes()).padStart(2, "0");

    return {
      dateFull: `${dd}-${mm}-${yyyy}`,
      dateShort: `${dd}-${mm}-${yy}`,
      timeFormatted: `${hh}:${min} ${ampm}`
    };
  }

  function getTrendInfo(pcrStr) {
    const pcr = parseFloat(pcrStr);
    if (Number.isNaN(pcr)) {
      return { label: "-", badgeClass: "text-zinc-400" };
    }
    if (pcr >= 1.98 || pcr >= 2) {
      return {
        label: "Buy",
        badgeClass:
          "inline-flex items-center rounded-md border border-purple-400/35 bg-purple-500/15 px-2 py-1 text-xs font-medium text-purple-300"
      };
    }
    if (pcr <= 0.50 || pcr <= 0.52) {
      return {
        label: "Sell",
        badgeClass:
          "inline-flex items-center rounded-md border border-pink-400/35 bg-pink-500/15 px-2 py-1 text-xs font-medium text-pink-300"
      };
    }
    if (pcr < 1.97 && pcr > 0.53) {
      return {
        label: "Neutral",
        badgeClass:
          "inline-flex items-center rounded-md border border-amber-400/35 bg-amber-500/15 px-2 py-1 text-xs font-medium text-amber-300"
      };
    }
    return {
      label: "-",
      badgeClass:
        "inline-flex items-center rounded-md border border-zinc-600/50 bg-zinc-900/80 px-2 py-1 text-xs font-medium text-zinc-300"
    };
  }

  // Finds the single nearest row per date for each target time within MAX_TIME_DIFF_MINUTES
  function buildHighlightedRowKeys(sourceRows) {
    const matchedKeys = new Set();
    const rowsByDate = new Map();

    for (const item of sourceRows) {
      if (!item.dateKey || item.minutesFromMidnight === null) continue;
      if (!rowsByDate.has(item.dateKey)) {
        rowsByDate.set(item.dateKey, []);
      }
      rowsByDate.get(item.dateKey).push(item);
    }

    for (const [, dayRows] of rowsByDate.entries()) {
      for (const targetMin of TARGET_MINUTES) {
        let bestRow = null;
        let bestDiff = Infinity;

        for (const item of dayRows) {
          const diff = Math.abs(item.minutesFromMidnight - targetMin);
          if (diff <= MAX_TIME_DIFF_MINUTES && diff < bestDiff) {
            bestDiff = diff;
            bestRow = item;
          }
        }

        if (bestRow) {
          matchedKeys.add(bestRow.rowKey);
        }
      }
    }

    return matchedKeys;
  }

  function applyPageSlice(sourceRows, page) {
    const totalPages = Math.max(1, Math.ceil(sourceRows.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page), totalPages);
    currentPage = safePage;

    const start = (safePage - 1) * PAGE_SIZE;
    rows = sourceRows.slice(start, start + PAGE_SIZE);
  }

  function resetTableState() {
    allFilteredRows = [];
    highlightedKeys = new Set();
    rows = [];
    currentPage = 1;
  }

  async function fetchAndFilterData(
    coin = selectedCoin,
    monthSuffix = selectedMonth,
    dateIso = selectedDate,
    page = currentPage,
    { silent = false } = {}
  ) {
    if (!silent) {
      loading = true;
      error = "";
    }

    try {
      const tabName = `${coin}_${monthSuffix}`;
      const expectedYearMonth = monthSuffixToYearMonth(monthSuffix);
      const tqQuery = "select A, D, E, F, G order by A desc";
      const cacheBust = Date.now();
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}&tq=${encodeURIComponent(tqQuery)}&_t=${cacheBust}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch ${tabName} (HTTP ${res.status})`);
      }

      const csvText = (await res.text()).trim();

      // Guard against Google gviz error or HTML fallback payloads
      if (
        !csvText ||
        csvText.includes("google.visualization.Query.setResponse") ||
        /^<!doctype html/i.test(csvText)
      ) {
        resetTableState();
        lastSyncedAt = formatSyncTime12Hr(new Date());
        error = "";
        return;
      }

      const lines = csvText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const dataLines =
        lines.length > 0 && lines[0].toLowerCase().includes("timestamp")
          ? lines.slice(1)
          : lines;

      const parsedRows = dataLines
        .map((line, index) => {
          const cols = parseCsvLine(line);
          const rawTs = cols[0] || "";
          const dt = parseTimestampToDate(rawTs);
          if (!dt) return null;

          const { dateFull, dateShort, timeFormatted } = splitDateAndTime12Hr(rawTs);
          const dateKey = toIsoDateKey(dt);
          if (!dateKey) return null;

          // Ensure row belongs to the selected month (prevents gviz fallback sheet leaks)
          if (expectedYearMonth && !dateKey.startsWith(expectedYearMonth)) {
            return null;
          }

          const totCallsM = cols[1] || "";
          const totPutsM = cols[2] || "";
          if (!hasValidCallsAndPuts(totCallsM, totPutsM)) {
            return null;
          }

          const pcrVal = cols[3] || "";

          return {
            rowKey: `${dateKey}__${rawTs}__${index}`,
            dateKey,
            minutesFromMidnight: getMinutesFromMidnight(dt),
            dateFull,
            dateShort,
            timeFormatted,
            totCallsM,
            totPutsM,
            pcr: pcrVal,
            trend: getTrendInfo(pcrVal),
            maxPain: cols[4] || ""
          };
        })
        .filter((item) => {
          if (!item) return false;
          if (!dateIso) return true;
          return item.dateKey === dateIso;
        });

      allFilteredRows = parsedRows;
      highlightedKeys = buildHighlightedRowKeys(parsedRows);
      applyPageSlice(allFilteredRows, page);
      lastSyncedAt = formatSyncTime12Hr(new Date());
      error = "";
    } catch (err) {
      if (!silent) {
        error = err?.message || "Could not load sheet data.";
        resetTableState();
      }
    } finally {
      if (!silent) {
        loading = false;
      }
    }
  }

  function switchCoin(coin) {
    if (selectedCoin === coin) return;
    selectedCoin = coin;
    resetTableState();
    fetchAndFilterData(coin, selectedMonth, selectedDate, 1);
  }

  function handleMonthChange(event) {
    selectedMonth = event.target.value;
    if (selectedDate && getMonthSuffixFromIsoDate(selectedDate) !== selectedMonth) {
      selectedDate = "";
    }
    resetTableState();
    fetchAndFilterData(selectedCoin, selectedMonth, selectedDate, 1);
  }

  function handleDateChange(event) {
    selectedDate = event.target.value;
    if (selectedDate) {
      selectedMonth = getMonthSuffixFromIsoDate(selectedDate);
    }
    fetchAndFilterData(selectedCoin, selectedMonth, selectedDate, 1);
  }

  function showAllDates() {
    selectedDate = "";
    fetchAndFilterData(selectedCoin, selectedMonth, "", 1);
  }

  function goToPage(pageNum) {
    if (loading || pageNum < 1 || pageNum > totalPages) return;
    applyPageSlice(allFilteredRows, pageNum);
  }

  function getRowHighlight(rowItem) {
    if (highlightedKeys.has(rowItem.rowKey)) {
      return "bg-amber-500/15 hover:bg-amber-500/20";
    }
    return "";
  }

  onMount(() => {
    fetchAndFilterData(selectedCoin, selectedMonth, selectedDate, 1);

    pollTimer = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchAndFilterData(selectedCoin, selectedMonth, selectedDate, currentPage, {
          silent: true
        });
      }
    }, AUTO_REFRESH_MS);
  });

  onDestroy(() => {
    if (pollTimer) {
      clearInterval(pollTimer);
    }
  });

  $: monthOptions = MONTHS.some((m) => m.value === selectedMonth)
    ? MONTHS
    : [{ value: selectedMonth, label: selectedMonth.replace("_", " ") }, ...MONTHS];
  $: totalPages = Math.max(1, Math.ceil(allFilteredRows.length / PAGE_SIZE));
  $: pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);
</script>

<main class=" bg-[#27272a] py-4 sm:py-6">
  <div class="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
    <!-- Top Header & Coin/Action Controls -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-base font-semibold text-white sm:text-lg">
          My Data Analytics ({selectedCoin} · {selectedMonth})
        </h1>
        <p class="mt-1 text-xs text-zinc-100 sm:text-sm">
          {selectedDate ? `Date: ${selectedDate}` : "All dates in month"} ·
          Page {currentPage} of {totalPages} ({allFilteredRows.length} rows)
          {#if lastSyncedAt}
            <span class="block sm:inline">
              <span class="hidden sm:inline">·</span> Synced {lastSyncedAt} (auto 60s)
            </span>
          {/if}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:flex-none">
        <button
          type="button"
          on:click={() => switchCoin("BTC")}
          class="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-semibold shadow-sm transition sm:flex-none {selectedCoin === 'BTC'
            ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 hover:text-white'
            : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-[#2f2f34] hover:text-white'}"
        >
          BTC
        </button>

        <button
          type="button"
          on:click={() => switchCoin("XAUT")}
          class="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-semibold shadow-sm transition sm:flex-none {selectedCoin === 'XAUT'
            ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 hover:text-white'
            : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-[#2f2f34] hover:text-white'}"
        >
          XAUT
        </button>

        <button
          type="button"
          on:click={() =>
            fetchAndFilterData(selectedCoin, selectedMonth, selectedDate, currentPage)
          }
          class="hidden cursor-pointer rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 sm:block sm:w-auto"
        >
          Refresh Now
        </button>
      </div>
    </div>

    <!-- Top Month & Date Filter Bar -->
    <div class="mt-4 flex flex-col gap-3 rounded-lg bg-[#27272a] px-3 py-3 shadow-sm ring-1 ring-inset ring-gray-200 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:px-4">
      <div class="hidden items-center gap-2 sm:flex">
        <label for="month-filter" class="text-sm font-medium text-zinc-100">
          Month:
        </label>
        <select
          id="month-filter"
          value={selectedMonth}
          on:change={handleMonthChange}
          class="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          {#each monthOptions as m}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-1 items-center gap-2 sm:flex-initial">
        <label for="date-filter" class="text-sm font-medium text-zinc-100">
          Date:
        </label>
        <input
          id="date-filter"
          type="date"
          value={selectedDate}
          on:change={handleDateChange}
          class="w-full cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 shadow-sm transition [color-scheme:dark] focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none sm:w-auto"
        />
      </div>
    </div>

    <!-- Scrollable Table Container with Sticky Header -->
    <div class="mt-4 flow-root sm:mt-6">
      <div class="overflow-hidden rounded-lg border border-zinc-700 bg-[#27272a] shadow-md">
        {#if loading}
          <div class="px-4 py-10 text-center text-sm text-zinc-300 sm:px-6">
            Loading page {currentPage}...
          </div>
        {:else if error}
          <div class="px-4 py-10 text-center text-sm font-medium text-red-300 sm:px-6">
            {error}
          </div>
        {:else if rows.length === 0}
          <div class="px-4 py-10 text-center text-sm text-zinc-300 sm:px-6">
            No rows found{selectedDate ? ` for ${selectedDate}` : ""} in {selectedCoin}_{selectedMonth}.
          </div>
        {:else}
          <div class="max-h-[44rem] overflow-auto sm:max-h-[52rem]">
            <table class="min-w-full divide-y divide-zinc-700 bg-[#27272a]">
              <thead class="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-xs">
                <tr class="divide-x divide-zinc-700/80">
                  <th
                    scope="col"
                    class="py-3 pr-2 pl-3 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:py-3.5 sm:pr-3 sm:pl-6 sm:text-sm sm:normal-case sm:tracking-normal"
                  >
                    Time (IST)
                  </th>
                  <th
                    scope="col"
                    class="px-2 py-3 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:px-3 sm:py-3.5 sm:text-sm sm:normal-case sm:tracking-normal"
                  >
                    Calls ($M)
                  </th>
                  <th
                    scope="col"
                    class="px-2 py-3 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:px-3 sm:py-3.5 sm:text-sm sm:normal-case sm:tracking-normal"
                  >
                    Puts ($M)
                  </th>
                  <th
                    scope="col"
                    class="px-2 py-3 text-left text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:px-3 sm:py-3.5 sm:text-sm sm:normal-case sm:tracking-normal"
                  >
                    PCR
                  </th>
                  <th
                    scope="col"
                    class="px-2 py-3 text-center text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:px-3 sm:py-3.5 sm:text-sm sm:normal-case sm:tracking-normal"
                  >
                    Trend
                  </th>
                  <th
                    scope="col"
                    class="py-3 pr-3 pl-2 text-right text-xs font-semibold tracking-wider text-zinc-200 uppercase sm:py-3.5 sm:pr-6 sm:pl-3 sm:text-sm sm:normal-case sm:tracking-normal"
                  >
                    Max Pain
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-zinc-700/80 bg-[#27272a]">
                {#each rows as r}
                  <tr class="divide-x divide-zinc-700/60 transition hover:bg-zinc-900/50 {getRowHighlight(r)}">
                    <td class="py-3 pr-2 pl-3 text-xs font-medium whitespace-nowrap text-zinc-200 tabular-nums sm:py-4 sm:pr-3 sm:pl-6 sm:text-sm">
                      {r.timeFormatted}
                    </td>
                    <td class="px-2 py-3 text-xs whitespace-nowrap text-zinc-100 tabular-nums sm:px-3 sm:py-4 sm:text-sm">
                      {r.totCallsM}
                    </td>
                    <td class="px-2 py-3 text-xs whitespace-nowrap text-zinc-100 tabular-nums sm:px-3 sm:py-4 sm:text-sm">
                      {r.totPutsM}
                    </td>
                    <td class="px-2 py-3 text-xs font-medium whitespace-nowrap text-indigo-300 tabular-nums sm:px-3 sm:py-4 sm:text-sm">
                      {r.pcr}
                    </td>
                    <td class="px-2 py-3 text-center text-xs whitespace-nowrap sm:px-3 sm:py-4 sm:text-sm">
                      <span class={r.trend.badgeClass}>{r.trend.label}</span>
                    </td>
                    <td class="py-3 pr-3 pl-2 text-right text-xs font-semibold whitespace-nowrap text-white tabular-nums sm:py-4 sm:pr-6 sm:pl-3 sm:text-sm">
                      {r.maxPain}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}

        <!-- Pagination Footer with 1, 2, 3... buttons -->
        <div class="flex flex-col gap-3 border-t border-zinc-700 bg-[#27272a] px-3 py-3 text-zinc-100 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div class="text-center text-xs text-zinc-400 tabular-nums sm:text-left sm:text-sm">
            Showing <span class="font-semibold text-zinc-200">{rows.length}</span> of
            <span class="font-semibold text-zinc-200">{allFilteredRows.length}</span> rows
          </div>

          <div class="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
            <button
              type="button"
              on:click={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              class="cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 shadow-sm transition hover:border-zinc-600 hover:bg-[#2f2f34] hover:text-white disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-900/40 disabled:text-zinc-500 disabled:opacity-60 sm:px-3 sm:text-sm"
            >
              Previous
            </button>

            {#each pageNumbers as num}
              <button
                type="button"
                on:click={() => goToPage(num)}
                disabled={loading}
                aria-current={num === currentPage ? "page" : undefined}
                class="cursor-pointer rounded-md border px-2.5 py-1.5 text-xs font-semibold tabular-nums shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm {num === currentPage
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 hover:text-white'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-[#2f2f34] hover:text-white'}"
              >
                {num}
              </button>
            {/each}

            <button
              type="button"
              on:click={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              class="cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 shadow-sm transition hover:border-zinc-600 hover:bg-[#2f2f34] hover:text-white disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-900/40 disabled:text-zinc-500 disabled:opacity-60 sm:px-3 sm:text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>