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
      if (!res.ok) {
        console.warn(`Could not fetch ${tabName}: HTTP ${res.status}`);
        return [];
      }

      const text = await res.text();
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
      if (!match) {
        console.warn(`Unexpected response format for ${tabName}.`);
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

  // Matches the first-occurrence PCR threshold highlights from your Apps Script
  function computeHighlightedRows(rows) {
    let highlightedBelow052 = false;
    let highlightedBelow050 = false;
    let highlightedAbove2 = false;
    let highlightedBelow2 = false;

    return rows.map((row) => {
      const pcr = Number(row.pcr);
      let rowBg = "";

      if (!Number.isNaN(pcr)) {
        if (pcr >= 0.52) highlightedBelow052 = false;
        if (pcr >= 0.50) highlightedBelow050 = false;
        if (pcr <= 2) highlightedAbove2 = false;
        if (pcr >= 2) highlightedBelow2 = false;

        if (pcr > 0.50 && pcr < 0.52 && !highlightedBelow052) {
          rowBg = "bg-amber-100";
          highlightedBelow052 = true;
        } else if (pcr < 0.50 && !highlightedBelow050) {
          rowBg = "bg-rose-100";
          highlightedBelow050 = true;
        } else if (pcr > 2 && !highlightedAbove2) {
          rowBg = "bg-sky-100";
          highlightedAbove2 = true;
        } else if (pcr < 2 && !highlightedBelow2) {
          rowBg = "bg-emerald-100";
          highlightedBelow2 = true;
        }
      }

      return { ...row, rowBg };
    });
  }

  onMount(() => {
    loadAllData();
  });

  $: monthSuffix = getCurrentMonthSuffixIST();
  $: activeRows = selectedCoin === "BTC" ? btcRows : xautRows;
  $: filteredRows = selectedDate
    ? activeRows.filter((r) => r.dateKey === selectedDate)
    : activeRows;
  $: displayedRows = computeHighlightedRows(filteredRows);
</script>

<main class="py-6">
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Delta Options Analytics ({selectedCoin} · {monthSuffix})
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Live options open interest, PCR, and Max Pain logged every 30 minutes from Delta Exchange.
        </p>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          on:click={() => (selectedCoin = "BTC")}
          class="rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm {selectedCoin === 'BTC'
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}"
        >
          BTC
        </button>

        <button
          type="button"
          on:click={() => (selectedCoin = "XAUT")}
          class="rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm {selectedCoin === 'XAUT'
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}"
        >
          XAUT
        </button>

        <input
          type="date"
          bind:value={selectedDate}
          aria-label="Filter by IST date"
          class="rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
        />

        <button
          type="button"
          on:click={() => (selectedDate = "")}
          class="rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Show All
        </button>

        <button
          type="button"
          on:click={loadAllData}
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Refresh
        </button>
      </div>
    </div>

    {#if loading}
      <p class="mt-6 text-sm text-gray-500">Loading options data...</p>
    {:else if error}
      <p class="mt-6 text-sm text-red-600">{error}</p>
    {:else if displayedRows.length === 0}
      <p class="mt-6 text-sm text-gray-500">
        No rows found for {selectedCoin} on {selectedDate || "selected filter"}.
      </p>
    {:else}
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle">
            <table class="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    Timestamp (IST)
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Expiry
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    Spot
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    Tot. Calls ($M)
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    Tot. Puts ($M)
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    PCR
                  </th>
                  <th
                    scope="col"
                    class="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    Max Pain
                  </th>
                </tr>
              </thead>
              <tbody>
                {#each displayedRows as r, idx}
                  <tr class={r.rowBg}>
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 {idx !== displayedRows.length - 1 ? 'border-b border-gray-200' : ''}"
                    >
                      {r.timestamp}
                    </td>
                    <td
                      class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell {idx !== displayedRows.length - 1 ? 'border-b border-gray-200' : ''}"
                    >
                      {r.expiry}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 {idx !== displayedRows.length - 1 ? 'border-b border-gray-200' : ''}"
                    >
                      {r.spot}
                    </td>
                    <td
                      class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell {idx !== displayedRows.length - 1 ? 'border-b border-gray-200' : ''}"
                    >
                      {r.totCallsM}
                    </td>
                    <td
                      class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell {idx !== displayedRows.length - 1 ? 'border-b border-gray-200' : ''}"
                    >
                      {r.totPutsM}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 {idx !== displayedRows.length - 1 ? 'border-b border-gray-200' : ''}"
                    >
                      {r.pcr}
                    </td>
                    <td
                      class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium text-gray-900 sm:pr-6 lg:pr-8 {idx !== displayedRows.length - 1 ? 'border-b border-gray-200' : ''}"
                    >
                      {r.maxPain}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>