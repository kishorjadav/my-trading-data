
<script>
  import { onMount } from "svelte";
  import Papa from "papaparse";
  import Loading from "$lib/svg/loading.svelte";
import { page } from "$app/stores";
import { goto } from "$app/navigation";

  $: items = [];
  $: searchCategory = $page.url.searchParams.get("category");

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHb4Hfm-5AJaDGswp4Io_85aim92dffSyORqfM3_SvhqVL0GzpwV5LurtjFDyNOILgJjTyWYgCLbb2/pub?output=csv";

  onMount(async () => {
    fetchData();
    
  });
//   image: row.main_image,
  $:console.log("items", items,searchCategory);
  
const fetchData = async () => {
    try {
      // Making two API requests concurrently using Promise.all
     const res = await fetch(sheetUrl);
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, { header: true });
    items = parsed.data.map((row, i) => ({
      id: i + 1,
      name: row.name,
      description: row.description,
      colors: row.colors,
      price: row.selling_price,
      mrps: row.mrp,
      size: row.sizes,
      image_type: row.img_type,
      image: row.main_image,
      category: row.category || "#",
    })).filter((item) => item?.category === searchCategory);
    } catch (error) {
      console.log("error", error);
      
    }
  };

  function setCategory(category) {
    const url = new URL($page.url);
    url.searchParams.set("category", category);
    goto(url.pathname + url.search, { replaceState: true }); // soft navigation
    fetchData();
  }
</script>


<div class="bg-white">
    <section aria-labelledby="sale-heading">
      <div class="overflow-hidden pt-32 sm:pt-14">
        <div class="bg-gray-800">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="relative pb-16 pt-48 sm:pb-24">
              <div>
                <h2 id="sale-heading" class="text-4xl font-bold tracking-tight text-white md:text-4xl">
                  From Still Photo to Thrill Photo 
                  <br />
                 
                </h2>
                <p class="text-white text-2xl mt-10"> Photo + Frames + Live Video</p>
                <div class="mt-6 text-base">
                  <!-- <a href="/store/products" class="font-semibold text-white">
                    Shop the sale
                    <span aria-hidden="true"> &rarr;</span>
                  </a> -->
                </div>
              </div>

              <div class="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                <div class="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                  <div class="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                    <div class="shrink-0">
                      <img src="https://m.media-amazon.com/images/I/71AxhS7L7AL._UF894,1000_QL80_.jpg" alt="" class="size-64 rounded-lg object-cover md:size-72" />
                    </div>

                    <div class="mt-6 shrink-0 sm:mt-0">
                      <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-category-02.jpg" alt="" class="size-64 rounded-lg object-cover md:size-72" />
                    </div>
                  </div>
                  <div class="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                    <div class="shrink-0">
                      <img src="https://cdn.shopify.com/s/files/1/0632/2526/6422/files/GP-LOC-01_28.jpg?v=1752869441" alt="" class="size-64 rounded-lg object-cover md:size-72" />
                    </div>

                    <div class="mt-6 shrink-0 sm:mt-0">
                      <img src="https://i5.walmartimages.com/asr/6c6fc12d-0b48-4f82-b9b8-5ecaf963e4ad.dcca95052b5158a3f689d45f5124b652.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" alt="" class="size-64 rounded-lg object-cover md:size-72" />
                    </div>
                  </div>
                  <div class="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                    <div class="shrink-0">
                      <img src="https://m.media-amazon.com/images/I/71AxhS7L7AL._UF894,1000_QL80_.jpg" alt="" class="size-64 rounded-lg object-cover md:size-72" />
                    </div>

                    <div class="mt-6 shrink-0 sm:mt-0">
                      <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-category-02.jpg" alt="" class="size-64 rounded-lg object-cover md:size-72" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  <div class="mx-auto max-w-2xl px-2 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
    <h2 class="sr-only">Products</h2>
    <!-- Buttons to change category -->
     
<div class="flex gap-4 md:my-6 mb-10 md:mb-0">
  <button
    class="px-4 py-2 border border-gray-500 text-black rounded"
    class:border-red-500={searchCategory === "wall_frames"}
    class:text-red-500={searchCategory === "wall_frames"}
    on:click={() => setCategory("wall_frames")}
  >
    Wall Frames
  </button>
  <button
    class="px-4 py-2 border border-gray-500 text-black rounded"
    class:border-red-500={searchCategory === "tables_frames"}
    class:text-red-500={searchCategory === "tables_frames"}
    on:click={() => setCategory("tables_frames")}
  >
    Table Frames  
  </button>
</div>

    <div
      class="grid grid-cols-2 gap-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 2xl:grid-cols-4 lg:gap-x-8"
    >
          {#if items.length === 0}
    <div class="flex justify-center w-full  col-span-2 lg:col-span-3 2xl:col-span-4"><Loading/></div>
  {:else} 

      {#each items as item}
      <a href="/store/products/{item.id}">
        <div
          class="group md:my-20 h-[415px] md:h-[510px] relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
        >
            {#if item?.image_type==="drive"}
          <iframe
            src={item?.image}
            alt={item?.name}
            class="aspect-[3/4] w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto h-60 sm:h-96"
          />
          {:else}
           <img
            src={item?.image}
            alt={item?.name}
            class="aspect-[3/4] w-full bg-gray-200 object-fill md:object-cover group-hover:opacity-75 sm:aspect-auto h-60 sm:h-96"
          />
          {/if}
          <hr class="border-gray-200" />
          <div class="flex flex-1 flex-col space-y-2 p-2 md:p-4">
             <p class="text-xs">#{item?.id}</p>
            <h3 class="text-sm font-medium text-gray-900">
              <div class="md:sr-only">
                <span aria-hidden="true" class="absolute inset-0"></span>
                 {item?.name && item?.name.length > 80
                    ? item?.name.slice(0, 80) + "..."
                    : item?.name}
              </div>
               <div class="sr-only md:not-sr-only">
                <span aria-hidden="true" class="absolute inset-0"></span>
                 {item?.name && item?.name.length > 90
                    ? item?.name.slice(0, 90) + "..."
                    : item?.name}
              </div>
            </h3>
            <!-- <p class="text-sm text-gray-500">
                {item?.description && item?.description.length > 160
                    ? item?.description.slice(0, 160) + "..."
                    : item?.description}
                </p> -->
                <!-- <p>{item?.category}</p> -->
            <div class="flex flex-1 flex-col justify-end">
              <p class="text-sm italic text-gray-500">{item?.colors}</p>
              <p class="text-xs md:text-sm italic text-green-500">Sizes: {item?.size && item?.size.length > 15
                    ? item?.size.slice(0, 15) + "..."
                    : item?.size}</p>
              <p class="text-base font-medium text-gray-900">{item?.price} <span class="text-xs text-gray-500">MRP-<s>{item?.mrps}</s></span></p>
            </div>
          </div>
        </div>
        </a>
      {/each}
      {/if}
    </div>
  </div>
</div>


<!-- drive url example
https://drive.google.com/file/d/1vI2cCOkB_8eyjs33v69E44eS2MEPaU6T/preview -->