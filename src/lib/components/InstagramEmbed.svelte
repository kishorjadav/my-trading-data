<script>
  import { onMount } from "svelte";
  export let url; // pass the Instagram post/reel URL here

  onMount(() => {
    // Load Instagram embed script
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });
</script>

<blockquote
  class="instagram-media"
  data-instgrm-permalink={url}
  data-instgrm-version="14"
  data-instgrm-captioned
 
  style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),
         0 1px 10px 0 rgba(0,0,0,0.15); margin:1px; max-width:1640px; min-width:1326px;
         padding:0; width:99.375%;"
  
>
</blockquote>







<!-- 
DOgFVvNEQWY
DObYOWeAbM_ -->
