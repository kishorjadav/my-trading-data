
<script>
  import { onMount } from "svelte";
  import Papa from "papaparse";
    import { page } from "$app/stores";
  import Loading from "$lib/svg/loading.svelte";


  let items = [];
  let mainImage = '';
  let thumbnails =[];

   let iframeKey = 0;
    let mainImageType = '';
  $: path = $page.url.pathname;
  $: size = $page.url.pathname.split("/")[3];
 $: orderView = false;

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHb4Hfm-5AJaDGswp4Io_85aim92dffSyORqfM3_SvhqVL0GzpwV5LurtjFDyNOILgJjTyWYgCLbb2/pub?output=csv";

  onMount(async () => {
    const res = await fetch(sheetUrl);
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, { header: true });
    items=parsed.data.map(item => item).filter((e)=>e.id===size);
    mainImage = items[0].main_image;
    mainImageType = items[0].img_type;
    thumbnails = [items[0].img_1, items[0].img_2, items[0].img_3, items[0].img_4].filter(img => img);
});
   
 function selectImage(url) {
    mainImage = url;
    mainImageType = url.includes("drive.google.com") ? "drive" : "url";

    if (mainImageType === "drive") {
      iframeKey += 1; // force iframe reload
    }
  }


  function isDriveUrl(url) {
    return url.includes("drive.google.com");
  }
  $:console.log("items details", items[0]);
  
function openDialog() {
    orderView = true;
  }
  function closeDialog() {
    orderView = false;
  }
  
</script>


<div class="bg-white">
   {#if items.length === 0}
       <div class="flex justify-center w-full col-span-1 sm:col-span-2 lg:col-span-3 2xl:col-span-4"><Loading/></div>

   {:else}
  <div class="mx-auto max-w-2xl px-2 md:py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
    <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <!-- Image gallery -->
      <div class="flex flex-col-reverse">
        <!-- Image selector -->
        <div class="mx-auto mt-6  w-full max-w-2xl sm:block lg:max-w-none">
           <!-- Thumbnails -->
        {#if thumbnails.length > 0}
          <div class="grid grid-cols-4 gap-4 mb-6">
            {#each thumbnails as thumb}
              <button  on:click={() => selectImage(thumb)} class="border w-20 border-gray-300 rounded-md p-1 hover:ring-2  overflow-hidden">
                {#if isDriveUrl(thumb)}
                  <iframe inert  src={thumb} class="h-20 w-20 object-cover rounded-md"></iframe>
                {:else}
                  <img src={thumb} alt="Thumbnail" class="h-20 w-20 object-cover rounded-md" />
                {/if}
              </button>
            {/each}
          </div>
        {/if}
        </div>

        <section>

            <!-- display image -->
         <div class="w-full">
          {#if isDriveUrl(mainImage)}
            <iframe  src={mainImage} class="aspect-square h-96 w-full object-cover sm:rounded-lg"></iframe>
          {:else}
            <img src={mainImage} alt="Main image" class="aspect-square w-full object-cover sm:rounded-lg" />
          {/if}
        </div>
         
        </section>
    </div>

      <!-- Product info -->
      <div class="mt-10 px-3  sm:mt-16 sm:px-4 lg:mt-0">
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{items[0]?.name}</h1>

        <div class="mt-3">
          <h2 class="sr-only">Product information</h2>
          <p class="text-3xl tracking-tight text-gray-900">{items[0]?.selling_price} <span class="text-xs text-gray-500">MRP-<s>{items[0]?.mrp}</s></span></p>
        </div>

        <!-- Reviews -->
       

        <div class="my-6 pb-6">
          <h3 class="sr-only">Description</h3>

          <div class="space-y-6 mt-5 text-base text-gray-600 ">
            <p class="pb-0">{@html items[0]?.description}</p>
             <p class="pb-0 text-orange-400">Size: {items[0]?.sizes}</p>
          </div>
        </div>

    <hr class="my-0 border-t border-gray-100" />


        <section aria-labelledby="details-heading" class="mt-0">
          <h2 id="details-heading" class="sr-only">Additional details</h2>

          <div class="divide-y divide-gray-200  border-gray-200">
            {#if items[0]?.features != ''}
            <div>
              <h3>
                <button type="button" command="--toggle" commandfor="detail-0" class="group relative flex w-full items-center justify-between py-6 text-left">
                  <span class="text-sm font-medium [&:not([aria-expanded='true']_*)]:text-gray-900 [[aria-expanded='true']_&]:text-indigo-600">Features</span>
                  
                </button>
              </h3>
              <el-disclosure id="detail-0" class="[&:not([hidden])]:contents">
                <div class="pb-6">
                  <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                    <li class="pl-2">{@html items[0]?.features}</li>
                  
                  </ul>
                </div>
              </el-disclosure>
            </div>
            {/if}
            <div>
              <h3>
                <button type="button" command="--toggle" commandfor="detail-1" class="group relative flex w-full items-center justify-between py-6 text-left">
                  <span class="text-sm font-medium [&:not([aria-expanded='true']_*)]:text-gray-900 [[aria-expanded='true']_&]:text-indigo-600">Package Includes</span>
                 
                </button>
              </h3>
            <div class="pb-6">
                  <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                    <li class="pl-2">{items[0]?.total_photos} Photo -> Frame -> {items[0]?.total_videos} Video access for lifetime</li>
                   
                  </ul>
                </div>
            </div>
            <div>
              <h3>
                <button type="button" command="--toggle" commandfor="detail-1" class="group relative flex w-full items-center justify-between py-6 text-left">
                  <span class="text-sm font-medium [&:not([aria-expanded='true']_*)]:text-gray-900 [[aria-expanded='true']_&]:text-indigo-600">How to Order?</span>
                 
                </button>
              </h3>
            <div class="pb-6">
                  <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                    <li class="pl-2">Click on Buy Now</li>
                   <li class="pl-2">Fill the details</li>
                   <li class="pl-2">We will contact you and get the order details</li>
                   <li class="pl-2">Once order ready, we will dispatch the order within 2 working day </li>
                     <li class="pl-2">We will share you the tracking details of the order</li>
                </ul>
                </div>
            </div>
            <div>
              <h3>
                <button type="button" command="--toggle" commandfor="detail-2" class="group relative flex w-full items-center justify-between py-6 text-left">
                  <span class="text-sm font-medium [&:not([aria-expanded='true']_*)]:text-gray-900 [[aria-expanded='true']_&]:text-indigo-600">Shipping</span>
                 
                </button>
              </h3>
               <div class="pb-6">
                  <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                    <li class="pl-2">Free shipping for all orders above 300 Rs. all over India</li>
                  
                 
                  </ul>
                </div>
            </div>
            <div class="cursor-pointer my-10">
                                <a href={`/order?productid=${items[0]?.id}`} command="show-modal" commandfor="dialog" class="bg-black rounded-md mb-20 text-white px-4 py-2 " > Buy Now</a>

                <!-- <button command="show-modal" commandfor="dialog" class="bg-black rounded-md text-white px-4 py-2 " on:click={openDialog}> Buy Now</button> -->
                <!-- <button  class="rounded-md bg-gray-950/5 text-red-500 px-2.5 py-1.5 text-sm font-semibold  hover:bg-gray-950/10 dark:bg-white/10 dark:text-white dark:ring-1 dark:ring-inset dark:ring-white/5 dark:hover:bg-white/20">Open dialog</button> -->

            </div>
           
          </div>
        </section>
      </div>
    </div>
  </div>
  {/if}
</div>

<!-- {#if orderView}
<el-dialog>
  <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 m-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent p-0 backdrop:bg-transparent">
    <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-900/50"></el-dialog-backdrop>

   <div class="fixed inset-0 z-50 flex items-center justify-center">
   
    <div
      class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/50"
      on:click={closeDialog}
    ></div>

 
    <div
      class="relative z-50 transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:max-w-lg sm:w-full sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div class="lg:order-last" style="opacity: 1; transform: none;">
       <form on:submit|preventDefault={handleSubmit}>
            <h2 class="font-display text-base font-semibold text-neutral-950">
              Work Enquiry
            </h2>
            <div class="isolate mt-6 -space-y-px rounded-2xl bg-white/50">
              <div class="group relative z-0 transition-all focus-within:z-10">
                <input
                  id="_S_1_"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="text"
                  name="name"
                 
                  required
                /><label
                  for="_S_1_"
                  class="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950"
                  >Name</label
                >
              </div>
             <div class="group relative z-0 transition-all focus-within:z-10">
                <input
                  id="_S_2_"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="email"
                  name="email"
                 
                  required
                /><label
                  for="_S_2_"
                  class="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950"
                  >Email</label
                >
              </div>
             
              <div class="group relative z-0 transition-all focus-within:z-10">
                <input
                  id="_S_4_"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="tel"
                  name="phone"
                  
                  required
                /><label
                  for="_S_4_"
                  class="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950"
                  >Phone</label
                >
              </div>
              <div class="group relative z-0 transition-all focus-within:z-10">
                <input
                  id="_S_3_"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="text"
                  name="pincode"
                 
                  required
                /><label
                  for="_S_3_"
                  class="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950"
                  >Pincode</label
                >
              </div>
              <div class="mt-2">
                 <fieldset>
                  <legend class="text-base/6 text-neutral-500 mb-3">Shipping Address</legend>
                 
                </fieldset>
                  <textarea
                  id="_S_5_"
                  placeholder=" "
                  rows="2"
                 
                  name="message"
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                ></textarea>
              </div>
            </div>
           
          </form>
        </div>

      <div class="mt-5 w-full sm:mt-6">
       <div class="flex justify-between  w-full gap-2">
        <div class="w-full"><button
          type="button"
          class="mt-3 w-full justify-center rounded-md bg-red-500 text-white px-3 py-2 text-sm font-semibold  shadow-sm "
          on:click={closeDialog}
        >
          Close
        </button></div>
        <div class="w-full"><button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-black text-white px-3 py-2 text-sm font-semibold  shadow-sm"
          on:click={order}
        >
          Order Now
        </button></div>
       </div>
        
         
      </div>
    </div>
  </div>
  </dialog>
</el-dialog>





{/if} -->