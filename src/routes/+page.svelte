<script lang="ts">
  	import { onMount } from 'svelte';
    	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/home');
	});

	
  // import Header from "$lib/components/header.svelte";
</script>



<!-- <main>
  <section>
   
    <Header/>
  </section>
</main> -->