<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let productId="";

  let name = '';
  let email = '';
  let phone = '';
  let address = '';
  let pincode = '';

  let sending = false;
  let success = null; // null | true | false
  let errorMessage = '';

  async function handleSubmit(e: Event) {
    e.preventDefault();
    sending = true;
    success = null;
    errorMessage = '';

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, pincode, address, productId })
      });

      const result = await res.json();

      if (res.ok && result.ok) {
        success = true;
        // reset UI
        name = email = phone = pincode = address = '';
      } else {
        success = false;
        errorMessage = result?.error || JSON.stringify(result?.upstream || result);
      }
    } catch (err) {
      success = false;
      errorMessage = err.message;
    } finally {
      sending = false;
    }
  }

   onMount(async () => {
     productId = $page.url.searchParams.get("productid");
     console.log("productId",productId);
     

});
</script>


<main class="w-full flex-auto mb-20 ">
  <div class="mx-auto max-w-7xl px-6 lg:px-8 md:my-20 sm:mt-32 lg:my-20">
    <div class="mx-auto max-w-2xl lg:max-w-none">
      <div style="opacity: 1; transform: none;">
        <h1>
          <span
            class="block font-display text-base font-semibold text-neutral-950"
            >Contact us</span
          ><span class="sr-only"> - </span><span
            class="mt-6 block max-w-5xl font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-6xl"
            >Let’s Order</span
          >
        </h1>
        <div class="mt-6 max-w-3xl text-xl text-neutral-600">
          <p>We can’t wait to hear from you.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl px-6 lg:px-8 mt-24 sm:mt-32 lg:mt-40">
    <div class="mx-auto max-w-2xl lg:max-w-none">
      <div class="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
        <div class="lg:order-last" style="opacity: 1; transform: none;">
       <form on:submit|preventDefault={handleSubmit}>
            <h2 class="font-display text-base font-semibold text-neutral-950">
              Order Enquiry
            </h2>
            <div class="isolate mt-6 -space-y-px rounded-2xl bg-white/50">
              <div class="group relative z-0 transition-all focus-within:z-10">
                <input
                  id="_S_1_"
                  autocomplete="name"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="text"
                  name="name"
                  bind:value={name}
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
                  autocomplete="email"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="email"
                  name="email"
                  bind:value={email}
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
                  autocomplete="tel"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="tel"
                  name="phone"
                  bind:value={phone}
                  required
                /><label
                  for="_S_4_"
                  class="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950"
                  >Phone</label
                >
              </div>
             
               <div class="group relative z-0 transition-all focus-within:z-10">
                <input
                  id="_S_4_"
                  autocomplete="tel"
                  placeholder=" "
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                  type="tel"
                  name="pincode"
                  bind:value={pincode}
                  required
                /><label
                  for="_S_4_"
                  class="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950"
                  >Pincode</label
                >
              </div>
              <div
                class="border border-neutral-300 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl"
              >
                <fieldset>
                  <legend class="text-base/6 text-neutral-500 mb-3">Shiping Address</legend>
                 
                </fieldset>
                  <textarea
                  id="address"
                  placeholder=""
                  rows="5"
                  bind:value={address}
                  name="address"
                  class="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
                ></textarea>
                 <div class="mt-6 flex items-center gap-4">
                  <button
                    class="inline-flex items-center  rounded-md bg-neutral-950 px-6 py-2  text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                    type="submit"
                    disabled={sending}
                  >
                    {#if sending}
                      <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="3" fill="none" stroke-opacity="0.25"/></svg>
                      Sending...
                    {:else}
                      Send Us
                    {/if}
                  </button>

                 

                  {#if success === false}
                  <div class="text-sm text-red-600">Error: {errorMessage}</div>
                  {/if}
                </div>
              </div>
              
            </div>
           
          </form>
        </div>
        <div style="opacity: 1; transform: none;">
          <h2 class="font-display text-base font-semibold text-neutral-950">
            Reach Out
          </h2>
          <p class="mt-6 text-base text-neutral-600">
            Connect with us easily—by email, call, or filling out the form.
Our team is ready to assist you with any queries.
We’ll get back to you within just a few hours.
Your satisfaction is our priority, and we’re here to help.
Reach out today and let’s bring your ideas to life together.
         
          <div
            class="mt-16 pt-16 relative before:absolute after:absolute before:bg-neutral-950 after:bg-neutral-950/10 before:top-0 before:left-0 before:h-px before:w-6 after:top-0 after:right-0 after:left-8 after:h-px"
          >
            <h2 class="font-display text-base font-semibold text-neutral-950">
              Email us
            </h2>
            <dl class="mt-6 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
              <div>
                <dt class="font-semibold text-neutral-950">Support Team</dt>
                <dd>
                  <a
                    class="text-neutral-600 hover:text-neutral-950"
                    href="mailto:treasureofmemorie@gmail.com"
                    >treasureofmemorie@gmail.com</a
                  >
                </dd>
              </div>
              <div>
                <dt class="font-semibold text-neutral-950">Mobile</dt>
                <dd>
                 
                    <a
                    class="text-neutral-600 hover:text-neutral-950"
                    href="tel:9008527266"
                  >
                    9008527266
                  </a>
                  ,
                  <a
                    class="text-neutral-600 hover:text-neutral-950"
                    href="tel:9632749557"
                  >
                    9632749557
                  </a>

                </dd>
              </div>
            </dl>
          </div>
          <div
            class="mt-16 pt-16 relative before:absolute after:absolute before:bg-neutral-950 after:bg-neutral-950/10 before:top-0 before:left-0 before:h-px before:w-6 after:top-0 after:right-0 after:left-8 after:h-px mb-10 "
          >
            <h2 class="font-display text-base font-semibold text-neutral-950">
              Follow us
            </h2>
            <ul role="list" class="flex gap-x-10 text-neutral-950 mt-6">
              
              <li>
                <a
                  aria-label="Instagram"
                  class="transition hover:text-neutral-700"
                  href="https://www.instagram.com/treasureofmemories_official/"
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="h-6 w-6 fill-current"
                    ><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.509.5.902 1.104 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.903 4.903 0 0 1-1.153 1.772c-.5.509-1.104.902-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.903 4.903 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 5.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63Zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.096 3.096 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058ZM12 6.865a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27Zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666Zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
                    ></path></svg
                  ></a
                >
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>




{#if success}
<div 
    class="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
>
    <!-- Modal wrapper -->
    <div class="relative p-4 w-full max-w-md">
        <!-- Modal content -->
        <div class="relative bg-white rounded-2xl shadow-lg dark:bg-gray-800">
            
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    🎉 Thank You!
                </h3>
                <button 
                    type="button" 
                    class="text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
                    on:click={() => success = null}
                >
                    <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close</span>
                </button>
            </div>

            <div class="p-6 text-center">
                <p class="text-base text-gray-600 dark:text-gray-300">
                    Your submission has been received successfully.  
                    We appreciate your trust and support! 💖
                </p>
            </div>

            <div class="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
                <a href="/store/products"
                    type="button" 
                    class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                    on:click={() => success = null}
                >
                    Close
            </a>
            </div>
        </div>
    </div>
</div>
{/if}


