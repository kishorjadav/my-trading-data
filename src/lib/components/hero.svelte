<script>
  import { onMount } from "svelte";

  const SHEET_ID = "1-pezJUG27TOIn8Hx49j9_yEnw4Y6je11mfkkeTKfGc8";

  let selectedCoin = "BTC";
  let selectedDate = getTodayIST();
  let btcRows = [];
  let xautRows = [];
  let loading = true;
  let error = "";

  function getTodayIST() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(now);

    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const d = parts.find((p) => p.type === "day")?.value;
    return `${y}-${m}-${d}`;
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

  function extractDateKey(cell) {
    if (!cell) return "";
    const candidates = [cell.f, cell.v].filter((x) => x !== null && x !== undefined);

    for (const val of candidates) {
      const str = String(val);

      // 1. Google gviz format: Date(year, monthIndex0to11, day, ...)
      const gviz = str.match(/Date\((\d+),(\d+),(\d+)/);
      if (gviz) {
        const y = gviz[1];
        const m = String(Number(gviz[2]) + 1).padStart(2, "0");
        const d = String(gviz[3]).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }

      // 2. ISO format: YYYY-MM-DD
      const iso = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (iso) {
        return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
      }

      // 3. Slash format: MM/DD/YYYY or DD/MM/YYYY
      const slash = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (slash) {
        const first = Number(slash[1]);
        const second = Number(slash[2]);
        const month = first > 12 ? second : first;
        const day = first > 12 ? first : second;
        return `${slash[3]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
    }

    return "";
  }

  async function fetchTabRows(tabName) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
      const res = await fetch(url);
      console.log("data",res)
      if (!res.ok) {
        console.warn(`Could not fetch ${tabName}: HTTP ${res.status}`);
        return [];
      }

      const text = await res.text();
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
      if (!match) {
        console.warn(`Unexpected response format for ${tabName} (check sheet sharing/permissions).`);
        return [];
      }

      const parsed = JSON.parse(match[1]);
      if (parsed.status === "error") {
        console.warn(`Google Sheets query error for ${tabName}:`, parsed.errors);
        return [];
      }

      const rows = parsed?.table?.rows || [];
      return rows
        .map((row) => {
          const c = row.c || [];
          const displayTs = c[0]?.f || String(c[0]?.v ?? "");
          return {
            timestamp: displayTs,
            dateKey: extractDateKey(c[0]),
            expiry: c[1]?.f || String(c[1]?.v ?? ""),
            spot: c[2]?.v ?? null,
            totCallsM: c[3]?.v ?? null,
            totPutsM: c[4]?.v ?? null,
            pcr: c[5]?.v ?? null,
            maxPain: c[6]?.v ?? null
          };
        })
        .filter((r) => r.timestamp);
    } catch (err) {
      console.warn(`Error loading ${tabName}:`, err);
      return [];
    }
  }

  async function loadAllData() {
    loading = true;
    error = "";
    try {
      const suffix = getCurrentMonthSuffixIST();
      const [btc, xaut] = await Promise.all([
        fetchTabRows(`BTC_${suffix}`),
        fetchTabRows(`XAUT_${suffix}`)
      ]);
      btcRows = btc;
      xautRows = xaut;
    } catch (err) {
      error = err?.message || "Could not load Google Sheet data.";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadAllData();
  });

  $: activeRows = selectedCoin === "BTC" ? btcRows : xautRows;
  $: filteredRows = selectedDate
    ? activeRows.filter((r) => r.dateKey === selectedDate)
    : activeRows;
</script>

<main>
  <h2>Delta Options Analytics</h2>

  <div class="controls">
    <button class:active={selectedCoin === "BTC"} on:click={() => (selectedCoin = "BTC")}>BTC</button>
    <button class:active={selectedCoin === "XAUT"} on:click={() => (selectedCoin = "XAUT")}>XAUT</button>

    <label>
      Date:
      <input type="date" bind:value={selectedDate} />
    </label>
    <button on:click={() => (selectedDate = "")}>Show All</button>
    <button on:click={loadAllData}>Refresh</button>
  </div>

  {#if loading}
    <p>Loading data...</p>
  {:else if error}
    <p>{error}</p>
  {:else if filteredRows.length === 0}
    <p>No rows found for {selectedCoin} on {selectedDate || "selected filter"}.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Timestamp (IST)</th>
          <th>Expiry</th>
          <th>Spot</th>
          <th>Tot. Calls ($M)</th>
          <th>Tot. Puts ($M)</th>
          <th>PCR</th>
          <th>Max Pain</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredRows as r}
          <tr>
            <td>{r.timestamp}</td>
            <td>{r.expiry}</td>
            <td>{r.spot}</td>
            <td>{r.totCallsM}</td>
            <td>{r.totPutsM}</td>
            <td>{r.pcr}</td>
            <td>{r.maxPain}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 16px;
  }
  button.active {
    font-weight: bold;
    outline: 2px solid #2563eb;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
</style>