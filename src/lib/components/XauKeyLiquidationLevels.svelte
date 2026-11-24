<script>
  import { onMount, onDestroy } from "svelte";

  const LIQUIDATION_ENDPOINT_URL =
    import.meta.env.VITE_LIQUIDATION_ENDPOINT_URL || "";
  const POLL_INTERVAL_MS = 15000;

  let sideFilter = "ALL"; // "ALL" | "ABOVE" | "BELOW"
  let refPrice = null;
  let aboveLevels = [];
  let belowLevels = [];
  let updatedAt = "";
  let isLoading = false;
  let hasLoaded = false;
  let errorMsg = "";
  let timer = null;

  function formatSizeM(val) {
    const n = Number(val);
    return Number.isFinite(n) ? `${n.toFixed(1)}M` : "—";
  }

  function formatPct(val) {
    const n = Number(val);
    if (!Number.isFinite(n)) return "—";
    return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
  }

  function formatPrice(val) {
    const n = Number(val);
    return Number.isFinite(n) ? n.toLocaleString("en-US") : "—";
  }

  $: maxSizeM = Math.max(
    1,
    ...aboveLevels.map((x) => Number(x.sizeM) || 0),
    ...belowLevels.map((x) => Number(x.sizeM) || 0)
  );

  async function loadLiquidationLevels({ silent = false } = {}) {
    if (!LIQUIDATION_ENDPOINT_URL) {
      errorMsg = "Set VITE_LIQUIDATION_ENDPOINT_URL in your .env file to start live updates.";
      return;
    }

    if (!silent || !hasLoaded) {
      isLoading = true;
    }
    errorMsg = "";

    try {
      const sep = LIQUIDATION_ENDPOINT_URL.includes("?") ? "&" : "?";
      const res = await fetch(`${LIQUIDATION_ENDPOINT_URL}${sep}_t=${Date.now()}`, {
        cache: "no-store"
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      refPrice = data.refPrice ?? null;
      aboveLevels = Array.isArray(data.above) ? data.above : [];
      belowLevels = Array.isArray(data.below) ? data.below : [];
      updatedAt = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      hasLoaded = true;
    } catch (err) {
      if (!hasLoaded) {
        errorMsg = err instanceof Error ? err.message : "Failed to load liquidation levels";
      }
    } finally {
      isLoading = false;
    }
  }

  function handleVisibilityChange() {
    if (typeof document !== "undefined" && !document.hidden) {
      loadLiquidationLevels({ silent: true });
    }
  }

  onMount(() => {
    loadLiquidationLevels({ silent: false });
    timer = setInterval(() => {
      if (typeof document === "undefined" || !document.hidden) {
        loadLiquidationLevels({ silent: true });
      }
    }, POLL_INTERVAL_MS);

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  });
</script>

<div class="rounded-xl border border-zinc-700 bg-[#27272a] p-4 text-zinc-100 shadow-lg sm:p-6">
  <!-- Header -->
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700 pb-4">
    <div>
      <div class="flex items-center gap-2">
        <h2 class="text-base font-semibold text-white sm:text-lg">Key liquidation levels</h2>
        <span class="rounded border border-zinc-600 bg-zinc-900/80 px-2 py-0.5 text-xs font-medium text-zinc-300">
          XAU • Live Feed
        </span>
      </div>
      <p class="mt-1 text-xs text-zinc-400">
        From price
        {#if refPrice !== null}
          <span class="font-semibold text-zinc-200 tabular-nums">{formatPrice(refPrice)}</span>
        {/if}
        {#if updatedAt}
          <span class="mx-1.5">•</span>
          <span>Synced {updatedAt} IST</span>
        {/if}
      </p>
    </div>

    <button
      type="button"
      on:click={() => loadLiquidationLevels({ silent: false })}
      disabled={isLoading}
      class="cursor-pointer rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-[#2f2f34] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Syncing..." : "Refresh"}
    </button>
  </div>

  <!-- Side Filter -->
  <div class="mt-4 flex flex-wrap items-center gap-1.5" role="group" aria-label="Liquidation side">
    <button
      type="button"
      on:click={() => (sideFilter = "ALL")}
      class="cursor-pointer rounded-md border px-2.5 py-1 text-xs font-semibold transition {sideFilter === 'ALL'
        ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
        : 'border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-600 hover:text-white'}"
    >
      All Levels
    </button>
    <button
      type="button"
      on:click={() => (sideFilter = "ABOVE")}
      class="cursor-pointer rounded-md border px-2.5 py-1 text-xs font-semibold transition {sideFilter === 'ABOVE'
        ? 'border-red-400/50 bg-red-500/20 text-red-200'
        : 'border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-600 hover:text-white'}"
    >
      Above · Shorts
    </button>
    <button
      type="button"
      on:click={() => (sideFilter = "BELOW")}
      class="cursor-pointer rounded-md border px-2.5 py-1 text-xs font-semibold transition {sideFilter === 'BELOW'
        ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
        : 'border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-600 hover:text-white'}"
    >
      Below · Longs
    </button>
  </div>

  {#if errorMsg}
    <div class="mt-5 rounded-lg border border-red-500/40 bg-red-950/50 p-4 text-sm text-red-200">
      {errorMsg}
    </div>
  {:else if isLoading && !hasLoaded}
    <div class="mt-5 rounded-lg border border-zinc-700 bg-zinc-900/60 p-8 text-center text-sm text-zinc-300">
      Loading XAU liquidation levels...
    </div>
  {:else}
    <div class="mt-5 space-y-5">
      {#if sideFilter === "ALL" || sideFilter === "ABOVE"}
        <div>
          <div class="mb-2 flex items-center justify-between text-xs">
            <span class="flex items-center gap-1.5 font-semibold text-red-300">
              <span class="h-2 w-2 rounded-full bg-red-400"></span>
              Above · short liquidations
            </span>
            <span class="text-zinc-400">From price</span>
          </div>

          <div class="divide-y divide-zinc-700/70 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/65">
            {#each aboveLevels as lvl}
              {@const widthPct = Math.min(100, Math.max(8, ((Number(lvl.sizeM) || 0) / maxSizeM) * 100))}
              <div class="grid grid-cols-[68px_1fr_96px] items-center gap-3 px-3 py-2 text-xs tabular-nums hover:bg-zinc-900">
                <span class="font-semibold text-white">{formatPrice(lvl.price)}</span>
                <div class="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    class="h-full rounded-full bg-red-400/80 transition-all duration-300"
                    style="width: {widthPct}%"
                  ></div>
                </div>
                <div class="flex items-center justify-end gap-2">
                  <span class="font-semibold text-zinc-100">{formatSizeM(lvl.sizeM)}</span>
                  <span class="text-red-300">{formatPct(lvl.pct)}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if sideFilter === "ALL" || sideFilter === "BELOW"}
        <div>
          <div class="mb-2 flex items-center justify-between text-xs">
            <span class="flex items-center gap-1.5 font-semibold text-emerald-300">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              Below · long liquidations
            </span>
            <span class="text-zinc-400">From price</span>
          </div>

          <div class="divide-y divide-zinc-700/70 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/65">
            {#each belowLevels as lvl}
              {@const widthPct = Math.min(100, Math.max(8, ((Number(lvl.sizeM) || 0) / maxSizeM) * 100))}
              <div class="grid grid-cols-[68px_1fr_96px] items-center gap-3 px-3 py-2 text-xs tabular-nums hover:bg-zinc-900">
                <span class="font-semibold text-white">{formatPrice(lvl.price)}</span>
                <div class="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    class="h-full rounded-full bg-emerald-400/80 transition-all duration-300"
                    style="width: {widthPct}%"
                  ></div>
                </div>
                <div class="flex items-center justify-end gap-2">
                  <span class="font-semibold text-zinc-100">{formatSizeM(lvl.sizeM)}</span>
                  <span class="text-emerald-300">{formatPct(lvl.pct)}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>