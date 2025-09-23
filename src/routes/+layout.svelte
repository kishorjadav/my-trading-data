<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

  let { children } = $props();
  import "../app.css";
</script>






<main>
  <section>
   
    <Header/>
  </section>
  <div>
   {@render children()}
  </div>
  <section>
   
    <Footer/>
  </section>
</main>