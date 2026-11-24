<script lang="ts">
  import { page } from "$app/stores";
  import Hero from "$lib/components/hero.svelte";
  import News from "$lib/components/news.svelte";
  import XauKeyLiquidationLevels from "$lib/components/XauKeyLiquidationLevels.svelte";
   import { onMount } from "svelte";
  $: path = $page.url.pathname;
  $: size = $page.url.pathname.split("/")[1];

   let name = "";
  let email = "";
  let phone = "";
  let message = "";


 // Replace with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxehrMTcfhPXo0WaY9qr55mxfDCfTyh_vGoibMAs2E14OJWZq_7McDlK8gVl6Ft4fYl1w/exec";

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const formData = { name, email, phone, message };

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (result.result === "success") {
        alert("✅ Message sent successfully!");
        // Reset fields
        name = "";
        email = "";
        phone = "";
        message = "";
      } else {
        alert("❌ Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error sending data.");
    }
  }
</script>


<section>
  <Hero/>
 
</section>
<section>
   <XauKeyLiquidationLevels/>
</section>
<section>
   <News/>
</section>


