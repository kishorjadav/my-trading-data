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

  function normalizeImpact(raw) {
    const val = String(raw || "").trim().toLowerCase();
    if (val === "high" || val === "red") return "High";
    if (val === "medium" || val === "orange") return "Medium";
    return String(raw || "").trim();
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

  $: availableDates = [...new Set(events.map((e) => e.date).filter(Boolean))];
  $: availableCurrencies = [...new Set(events.map((e) => e.currency).filter(Boolean))].sort();

  $: filteredEvents = events.filter((e) => {
    if (selectedDate !== "ALL" && e.date !== selectedDate) return false;
    if (selectedCurrency !== "ALL" && e.currency !== selectedCurrency) return false;
    if (selectedImpact !== "ALL" && e.impact !== selectedImpact) return false;
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

<main class="page-wrap">
  <section class="ff-panel">
    <div class="ff-toolbar">
      <div class="ff-title-wrap">
        <h1>Forex Factory Calendar</h1>
        {#if lastUpdated}
          <span class="ff-sync">Synced {lastUpdated} IST</span>
        {/if}
      </div>

      <div class="ff-filters">
        <select bind:value={selectedDate} aria-label="Filter by Date">
          <option value="ALL">All Dates</option>
          {#each availableDates as d}
            <option value={d}>{formatDisplayDate(d, isMobile)}</option>
          {/each}
        </select>

        <select bind:value={selectedCurrency} aria-label="Filter by Currency">
          <option value="ALL">All Currencies</option>
          {#each availableCurrencies as c}
            <option value={c}>{c}</option>
          {/each}
        </select>

        <select bind:value={selectedImpact} aria-label="Filter by Impact">
          <option value="ALL">All Impact</option>
          <option value="High">High (Red)</option>
          <option value="Medium">Medium (Orange)</option>
        </select>

        {#if !isMobile}
          <button type="button" on:click={() => fetchForexEvents({ silent: false })} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        {/if}
      </div>
    </div>

    {#if errorMsg}
      <div class="ff-error">{errorMsg}</div>
    {:else if isLoading && !hasLoadedOnce}
      <div class="ff-empty">Loading economic calendar...</div>
    {:else if filteredEvents.length === 0}
      <div class="ff-empty">
        No High or Medium impact events for {selectedDate === "ALL" ? "selected filter" : formatDisplayDate(selectedDate, isMobile)}.
      </div>
    {:else}
      <div class="ff-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time (IST)</th>
              <th>Currency</th>
              <th>Impact</th>
              <th>Event</th>
              <th>Actual</th>
              <th>Forecast</th>
              <th>Previous</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredEvents as row}
              <tr>
                <td>{formatDisplayDate(row.date, isMobile)}</td>
                <td>{row.timeIst}</td>
                <td class="curr">{row.currency}</td>
                <td>
                  <span class="badge {row.impact === 'High' ? 'high' : 'medium'}">
                    {row.impact}
                  </span>
                </td>
                <td class="event-name">{row.event}</td>
                <td class="actual">{row.actual || "—"}</td>
                <td>{row.forecast || "—"}</td>
                <td>{row.previous || "—"}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</main>

<style>
  .page-wrap {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1rem;
  }

  .ff-panel {
    background: #12161f;
    color: #e6edf3;
    border: 1px solid #262f40;
    border-radius: 10px;
    padding: 0.9rem;
  }

  .ff-toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.8rem;
  }

  .ff-title-wrap {
    display: flex;
    align-items: baseline;
    gap: 0.65rem;
  }

  .ff-title-wrap h1 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
  }

  .ff-sync {
    font-size: 0.75rem;
    color: #9aa7b8;
  }

  .ff-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  select,
  button {
    background: #1b2230;
    color: #e6edf3;
    border: 1px solid #303b52;
    border-radius: 6px;
    padding: 0.35rem 0.55rem;
    font-size: 0.8rem;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ff-table-wrap {
    max-height: 480px;
    overflow: auto;
    border: 1px solid #262f40;
    border-radius: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    white-space: nowrap;
  }

  thead th {
    position: sticky;
    top: 0;
    background: #19202e;
    color: #b8c4d4;
    text-align: left;
    padding: 0.55rem 0.65rem;
    border-bottom: 1px solid #2c374c;
    z-index: 1;
  }

  tbody td {
    padding: 0.5rem 0.65rem;
    border-bottom: 1px solid #1e2636;
  }

  tbody tr:hover {
    background: #171e2b;
  }

  .curr {
    font-weight: 600;
  }

  .event-name {
    white-space: normal;
    min-width: 180px;
  }

  .actual {
    font-weight: 600;
    color: #58a6ff;
  }

  .badge {
    display: inline-block;
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
  }

  .badge.high {
    background: rgba(248, 81, 73, 0.18);
    color: #ff7b72;
    border: 1px solid rgba(248, 81, 73, 0.45);
  }

  .badge.medium {
    background: rgba(210, 153, 34, 0.18);
    color: #e3b341;
    border: 1px solid rgba(210, 153, 34, 0.45);
  }

  .ff-empty,
  .ff-error {
    padding: 1.1rem;
    text-align: center;
    font-size: 0.85rem;
    color: #9aa7b8;
  }

  .ff-error {
    color: #ff7b72;
  }
</style>