<script>
    import Productcard from "$lib/components/productcard.svelte";
     import { onMount } from "svelte";
      onMount(() => {
    const url = new URL(window.location.href);

    if (!url.searchParams.has("category")) {
      url.searchParams.set("category", "wall_frames");
      window.location.replace(url); // triggers full refresh
    }
    });
</script>

<Productcard/>