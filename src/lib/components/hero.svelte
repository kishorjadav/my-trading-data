<script>
  export let src =
    "blob:https://www.instagram.com/13c9f90c-0459-46e8-9071-0494b7c7993e";
  import InstagramEmbed from "./InstagramEmbed.svelte";
  import Comments from "./comments.svelte";
  import Canva from "./canva.svelte";
  let videoId = "zFJGhSTidS4";
  let videoId2 = "trGOOiRwu54";
  
  let src1 = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  let src2 = `https://www.youtube.com/embed/${videoId2}?autoplay=1&mute=1&loop=1&playlist=${videoId2}`;
  let src3 = `https://www.youtube.com/embed/${'dyFxDyMwx8I'}?autoplay=1&mute=1&loop=1&playlist=${'dyFxDyMwx8I'}`;
  // https://youtube.com/shorts/dyFxDyMwx8I

  // https://youtube.com/shorts/trGOOiRwu54?feature=share
</script>

<div class="overflow-hidden md:py-20 lg:pb-32 xl:pb-36">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
      <div
        class="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6"
      >
        <h1 class="text-4xl font-medium tracking-tight text-gray-900">
          We Frame Your Memories into One Beautiful Stories for Lifetime.
        </h1>
        <p class="mt-6 text-lg text-gray-600">
          Make every memories unforgettable with Frames, Albums and Books that
          tells you a story behind every photo.
        </p>
        <p class="mt-6 text-lg text-gray-600">
          We offer a wide variety of handcrafted photo frames to suit every
          style and space. Whether you're decorating your home or gifting a
          loved one, our frames turn your memories into timeless stories.
        </p>
        <p class="mt-6 text-lg text-gray-600">
          Shop handcrafted photo frames, including gallery walls, wooden collage
          frames, and candid photo frames, albums, books. Turn your favorite
          memories into timeless decor pieces. Affordable, Stylish, and
          Customizable.
        </p>
        <div class="mt-8 flex flex-wrap gap-x-6 gap-y-4">
          <!-- <a
            aria-label="Download on the App Store"
            class="rounded-lg transition-colors bg-gray-800 text-white hover:bg-gray-900"
            href="#"
            >
            <svg viewBox="0 0 120 40" aria-hidden="true" class="h-10"
              ><path
                fill="currentColor"
                d="M24.769 20.301a4.947 4.947 0 0 1 2.357-4.152 5.066 5.066 0 0 0-3.992-2.157c-1.679-.177-3.307 1.004-4.163 1.004-.872 0-2.19-.987-3.608-.958a5.315 5.315 0 0 0-4.473 2.728c-1.934 3.349-.491 8.27 1.361 10.976.927 1.326 2.01 2.806 3.428 2.753 1.387-.057 1.905-.884 3.58-.884 1.658 0 2.144.884 3.59.851 1.489-.024 2.426-1.331 3.32-2.669a10.96 10.96 0 0 0 1.52-3.092 4.782 4.782 0 0 1-2.92-4.4ZM22.037 12.211a4.872 4.872 0 0 0 1.115-3.49 4.957 4.957 0 0 0-3.208 1.66 4.635 4.635 0 0 0-1.143 3.36 4.099 4.099 0 0 0 3.236-1.53ZM42.302 27.14H37.57l-1.137 3.356h-2.005l4.484-12.418h2.083l4.483 12.418h-2.039l-1.136-3.356Zm-4.243-1.55h3.752l-1.85-5.446h-.051l-1.85 5.447ZM55.16 25.97c0 2.813-1.506 4.62-3.779 4.62a3.068 3.068 0 0 1-2.848-1.584h-.043v4.485H46.63V21.442h1.8v1.506h.033a3.21 3.21 0 0 1 2.883-1.6c2.298 0 3.813 1.816 3.813 4.622Zm-1.91 0c0-1.833-.948-3.039-2.393-3.039-1.42 0-2.375 1.23-2.375 3.038 0 1.825.955 3.046 2.375 3.046 1.445 0 2.392-1.196 2.392-3.046ZM65.124 25.97c0 2.813-1.505 4.62-3.778 4.62a3.07 3.07 0 0 1-2.848-1.584h-.043v4.485h-1.859V21.442h1.799v1.506h.034a3.21 3.21 0 0 1 2.883-1.6c2.298 0 3.813 1.816 3.813 4.621Zm-1.91 0c0-1.834-.947-3.039-2.392-3.039-1.42 0-2.375 1.23-2.375 3.038 0 1.825.955 3.046 2.375 3.046 1.445 0 2.392-1.196 2.392-3.046ZM71.71 27.036c.138 1.232 1.335 2.04 2.97 2.04 1.566 0 2.693-.808 2.693-1.919 0-.964-.68-1.54-2.29-1.936l-1.609-.388c-2.28-.55-3.339-1.617-3.339-3.348 0-2.142 1.867-3.614 4.519-3.614 2.624 0 4.423 1.472 4.483 3.614h-1.876c-.112-1.239-1.136-1.987-2.634-1.987-1.497 0-2.521.757-2.521 1.858 0 .878.654 1.395 2.255 1.79l1.368.336c2.548.603 3.606 1.626 3.606 3.443 0 2.323-1.85 3.778-4.793 3.778-2.754 0-4.614-1.42-4.734-3.667h1.902ZM83.346 19.3v2.142h1.722v1.472h-1.722v4.991c0 .776.345 1.137 1.102 1.137.204-.004.408-.018.611-.043v1.463c-.34.064-.686.092-1.032.086-1.833 0-2.548-.689-2.548-2.444v-5.19h-1.316v-1.472h1.316V19.3h1.867ZM86.065 25.97c0-2.849 1.678-4.639 4.294-4.639 2.625 0 4.295 1.79 4.295 4.639 0 2.856-1.661 4.638-4.295 4.638-2.633 0-4.294-1.782-4.294-4.638Zm6.695 0c0-1.954-.895-3.108-2.401-3.108-1.506 0-2.4 1.162-2.4 3.108 0 1.962.894 3.106 2.4 3.106 1.506 0 2.401-1.144 2.401-3.106ZM96.186 21.442h1.772v1.541h.043a2.16 2.16 0 0 1 2.178-1.636c.214 0 .428.023.637.07v1.738a2.594 2.594 0 0 0-.835-.112 1.872 1.872 0 0 0-1.937 2.083v5.37h-1.858v-9.054ZM109.384 27.837c-.25 1.643-1.85 2.771-3.898 2.771-2.634 0-4.269-1.764-4.269-4.595 0-2.84 1.644-4.682 4.191-4.682 2.505 0 4.08 1.72 4.08 4.466v.637h-6.395v.112a2.353 2.353 0 0 0 .639 1.832 2.364 2.364 0 0 0 1.797.732 2.045 2.045 0 0 0 2.091-1.273h1.764Zm-6.282-2.702h4.526a2.167 2.167 0 0 0-.608-1.634 2.168 2.168 0 0 0-1.612-.664 2.293 2.293 0 0 0-2.306 2.298ZM37.826 8.731a2.64 2.64 0 0 1 2.808 2.965c0 1.906-1.03 3.002-2.808 3.002h-2.155V8.731h2.155Zm-1.228 5.123h1.125a1.877 1.877 0 0 0 1.967-2.146 1.881 1.881 0 0 0-1.967-2.133h-1.125v4.28ZM41.68 12.445a2.133 2.133 0 1 1 4.248 0 2.132 2.132 0 1 1-4.247 0Zm3.334 0c0-.976-.439-1.547-1.209-1.547-.772 0-1.206.57-1.206 1.547 0 .984.434 1.55 1.207 1.55.769 0 1.208-.57 1.208-1.55ZM51.573 14.697h-.922l-.93-3.316h-.07l-.927 3.316h-.913l-1.242-4.503h.902l.806 3.436h.067l.925-3.436h.853l.926 3.436h.07l.803-3.436h.889l-1.237 4.503ZM53.853 10.195h.856v.715h.066a1.348 1.348 0 0 1 1.344-.802 1.466 1.466 0 0 1 1.559 1.675v2.915h-.889v-2.692c0-.724-.314-1.084-.972-1.084a1.034 1.034 0 0 0-1.075 1.141v2.635h-.889v-4.503ZM59.094 8.437h.888v6.26h-.888v-6.26ZM61.218 12.444a2.133 2.133 0 1 1 4.248 0 2.134 2.134 0 1 1-4.248 0Zm3.333 0c0-.976-.439-1.547-1.208-1.547-.772 0-1.207.57-1.207 1.547 0 .984.435 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55ZM66.4 13.425c0-.81.604-1.278 1.676-1.344l1.22-.07v-.39c0-.475-.315-.744-.922-.744-.497 0-.84.183-.939.5h-.86c.09-.773.818-1.269 1.84-1.269 1.128 0 1.765.562 1.765 1.514v3.076h-.855v-.633h-.07a1.515 1.515 0 0 1-1.353.707 1.36 1.36 0 0 1-1.501-1.347Zm2.895-.385v-.376l-1.1.07c-.62.041-.9.252-.9.65 0 .405.351.64.834.64a1.062 1.062 0 0 0 1.166-.984ZM71.348 12.444c0-1.423.732-2.324 1.87-2.324a1.484 1.484 0 0 1 1.38.79h.067V8.437h.888v6.26h-.851v-.711h-.07a1.563 1.563 0 0 1-1.415.785c-1.145 0-1.869-.9-1.869-2.327Zm.918 0c0 .955.45 1.53 1.203 1.53.75 0 1.212-.583 1.212-1.526 0-.939-.468-1.53-1.212-1.53-.748 0-1.203.579-1.203 1.526ZM79.23 12.445a2.133 2.133 0 1 1 4.247 0 2.132 2.132 0 1 1-4.247 0Zm3.333 0c0-.976-.439-1.547-1.208-1.547-.773 0-1.207.57-1.207 1.547 0 .984.434 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55ZM84.67 10.195h.855v.715h.066a1.349 1.349 0 0 1 1.344-.802 1.466 1.466 0 0 1 1.559 1.675v2.915h-.889v-2.692c0-.724-.315-1.084-.972-1.084a1.034 1.034 0 0 0-1.075 1.141v2.635h-.889v-4.503ZM93.515 9.074v1.142h.976v.748h-.976v2.316c0 .472.195.678.637.678.113 0 .226-.007.339-.02v.74c-.16.028-.322.043-.484.045-.988 0-1.382-.348-1.382-1.216v-2.543h-.714v-.748h.715V9.074h.89ZM95.705 8.437h.88v2.481h.07a1.386 1.386 0 0 1 1.374-.807 1.485 1.485 0 0 1 1.55 1.679v2.907h-.889V12.01c0-.719-.335-1.083-.963-1.083a1.05 1.05 0 0 0-1.134 1.141v2.63h-.888v-6.26ZM104.761 13.482a1.823 1.823 0 0 1-1.951 1.302 2.047 2.047 0 0 1-2.08-2.324 2.093 2.093 0 0 1 .071-.88 2.08 2.08 0 0 1 2.005-1.473c1.253 0 2.009.856 2.009 2.27v.31h-3.18v.05a1.19 1.19 0 0 0 1.2 1.29 1.077 1.077 0 0 0 1.071-.545h.855Zm-3.126-1.452h2.275a1.094 1.094 0 0 0-.667-1.084 1.086 1.086 0 0 0-.442-.082 1.151 1.151 0 0 0-1.166 1.166Z"
              ></path></svg
            >
            </a
          > -->
          <a
            class="inline-flex justify-center rounded-lg border py-[calc(--spacing(2)-1px)] px-[calc(--spacing(3)-1px)] text-sm transition-colors border-gray-300 text-gray-700 hover:border-gray-400 bg-black text-white"
            variant="outline"
            color="gray"
            href="/contact"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            <span class="ml-2.5">Enquiry Now</span></a
          >
        </div>
      </div>
      <div
        class="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6"
      >
        <div
          class="absolute top-4 left-1/2 h-[1026px] w-[1026px] -translate-x-1/3 mask-[linear-gradient(to_bottom,white_20%,transparent_75%)] stroke-gray-300/70 sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0"
        >
          <svg
            viewBox="0 0 1026 1026"
            fill="none"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full animate-spin-slow"
            ><path
              d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
              stroke="#D4D4D4"
              stroke-opacity="0.7"
            ></path><path
              d="M513 1025C230.23 1025 1 795.77 1 513"
              stroke="url(#_S_3_-gradient-1)"
              stroke-linecap="round"
            ></path><defs
              ><linearGradient
                id="_S_3_-gradient-1"
                x1="1"
                y1="513"
                x2="1"
                y2="1025"
                gradientUnits="userSpaceOnUse"
                ><stop stop-color="#06b6d4"></stop><stop
                  offset="1"
                  stop-color="#06b6d4"
                  stop-opacity="0"
                ></stop></linearGradient
              ></defs
            ></svg
          ><svg
            viewBox="0 0 1026 1026"
            fill="none"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full animate-spin-reverse-slower"
            ><path
              d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
              stroke="#D4D4D4"
              stroke-opacity="0.7"
            ></path><path
              d="M913 513c0 220.914-179.086 400-400 400"
              stroke="url(#_S_3_-gradient-2)"
              stroke-linecap="round"
            ></path><defs
              ><linearGradient
                id="_S_3_-gradient-2"
                x1="913"
                y1="513"
                x2="913"
                y2="913"
                gradientUnits="userSpaceOnUse"
                ><stop stop-color="#06b6d4"></stop><stop
                  offset="1"
                  stop-color="#06b6d4"
                  stop-opacity="0"
                ></stop></linearGradient
              ></defs
            ></svg
          >
        </div>
        <div
          class="-mx-4 px-9 sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-10 lg:-bottom-20 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32"
        >
          <div class="relative aspect-366/729 mx-auto max-w-[366px]">
            <div
              class="absolute inset-y-[calc(1/729*100%)] right-[calc(5/729*100%)] left-[calc(7/729*100%)] rounded-[calc(58/366*100%)/calc(58/729*100%)] shadow-2xl"
            ></div>
            <div
              class="absolute top-[calc(23/729*100%)] left-[calc(23/366*100%)] grid h-[calc(686/729*100%)] w-[calc(318/366*100%)] transform grid-cols-1 overflow-hidden bg-gray-900 pt-[calc(23/318*100%)]"
            >
              <div class="flex flex-col">
                <iframe
                  width="100%"
                  height="500"
                  src={src2}
                  frameborder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <svg
              viewBox="0 0 366 729"
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 h-full w-full fill-gray-100"
              ><path
                fill="#F2F2F2"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M300.092 1c41.22 0 63.223 21.99 63.223 63.213V184.94c-.173.184-.329.476-.458.851.188-.282.404-.547.647-.791.844-.073 2.496.257 2.496 2.157V268.719c-.406 2.023-2.605 2.023-2.605 2.023a7.119 7.119 0 0 1-.08-.102v394.462c0 41.213-22.001 63.212-63.223 63.212h-95.074c-.881-.468-2.474-.795-4.323-.838l-33.704-.005-.049.001h-.231l-.141-.001c-2.028 0-3.798.339-4.745.843H66.751c-41.223 0-63.223-21.995-63.223-63.208V287.739c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 284.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-16.289c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 214.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-26.041a2.26 2.26 0 0 0 .093-.236l-.064-.01a3.337 3.337 0 0 1-.72-.12l-.166-.028A2 2 0 0 1 1 135.62v-24.611a2 2 0 0 1 1.671-1.973l.857-.143v-44.68C3.528 22.99 25.53 1 66.75 1h233.341ZM3.952 234.516a5.481 5.481 0 0 0-.229-.278c.082.071.159.163.228.278Zm89.99-206.304A4.213 4.213 0 0 0 89.727 24H56.864C38.714 24 24 38.708 24 56.852v618.296C24 693.292 38.714 708 56.864 708h250.272c18.15 0 32.864-14.708 32.864-32.852V56.852C340 38.708 325.286 24 307.136 24h-32.864a4.212 4.212 0 0 0-4.213 4.212v2.527c0 10.235-8.3 18.532-18.539 18.532H112.48c-10.239 0-18.539-8.297-18.539-18.532v-2.527Z"
              ></path><rect
                x="154"
                y="29"
                width="56"
                height="5"
                rx="2.5"
                fill="#D4D4D4"
              ></rect></svg
            >
          </div>
        </div>
      </div>
      <div class="relative my-20 lg:col-span-7 lg:mt-0 xl:col-span-6">
        <p class="text-center text-base font-semibold text-gray-900 lg:text-left">
          Your static photos, brought to life as videos—quickly and seamlessly.
        </p>
        <p class="text-[oklch(58.8%_0.158_241.966)] mt-5  font-bold text-lg"> Simply scan any photo, and a video will instantly play on your mobile phone.</p>
        <!-- <ul
          role="list"
          class="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-10 gap-y-8 lg:mx-0 lg:justify-start"
        >
          <li class="flex">
            <img
              alt="Forbes"
              loading="lazy"
              width="82"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/forbes.c4b4b0dd.svg"
            />
          </li>
          <li class="flex">
            <img
              alt="TechCrunch"
              loading="lazy"
              width="181"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/techcrunch.fe121d74.svg"
            />
          </li>
          <li class="flex">
            <img
              alt="Wired"
              loading="lazy"
              width="121"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/wired.42c588dc.svg"
            />
          </li>
          <li class="flex hidden xl:block">
            <img
              alt="CNN"
              loading="lazy"
              width="68"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/cnn.eaae184a.svg"
            />
          </li>
          <li class="flex">
            <img
              alt="BBC"
              loading="lazy"
              width="83"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/bbc.9cfc75a9.svg"
            />
          </li>
          <li class="flex">
            <img
              alt="CBS"
              loading="lazy"
              width="101"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/cbs.aa596395.svg"
            />
          </li>
          <li class="flex">
            <img
              alt="Fast Company"
              loading="lazy"
              width="124"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/fast-company.8fba32a5.svg"
            />
          </li>
          <li class="flex hidden xl:block">
            <img
              alt="HuffPost"
              loading="lazy"
              width="142"
              height="32"
              decoding="async"
              data-nimg="1"
              class="h-8"
              style="color:transparent"
              src="/_next/static/media/huffpost.eeec742f.svg"
            />
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</div>

<section
  id="secondary-features"
  aria-label="Features for building a portfolio"
  class="py-20 sm:py-32"
>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl sm:text-center">
      <h2 class="text-3xl font-medium tracking-tight text-gray-900">
        Features of Treasure of Memories
      </h2>
      <p class="mt-2 text-lg text-gray-600">
        Treasure of Memories offers personalized frames and albums that
        beautifully preserve your special moments. With photo and video
        integration, lifetime free access, and elegant craftsmanship, your
        memories stay safe, timeless, and easy to share with loved ones.
      </p>
    </div>
    <ul
      role="list"
      class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 lg:max-w-none lg:grid-cols-3"
    >
      <li class="rounded-2xl border border-gray-200 p-8">
        <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
          ><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
            fill="#737373"
          ></path><path
            d="M12 25l8-8m0 0h-6m6 0v6"
            stroke="#171717"
            stroke-width="2"
            stroke-linecap="round"
          ></path><circle
            cx="16"
            cy="16"
            r="16"
            fill="#A3A3A3"
            fill-opacity="0.2"
          ></circle></svg
        >
        <h3 class="mt-6 text-2xl font-semibold text-[oklch(58.8%_0.158_241.966)]">Integration</h3>
        <p class="mt-2 text-base text-gray-700">
          Turn your printed or digital photos into living video memories. Just
          scan a photo with your phone and watch it instantly come alive with
          the stories you love.
        </p>
      </li>
      <li class="rounded-2xl border border-gray-200 p-8">
        <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
          ><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
            fill="#737373"
          ></path><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9 13a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm1 5a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-1-1H10z"
            fill="url(#_S_4_-gradient)"
          ></path><rect x="9" y="6" width="14" height="4" rx="1" fill="#171717"
          ></rect><circle
            cx="16"
            cy="16"
            r="16"
            fill="#A3A3A3"
            fill-opacity="0.2"
          ></circle><defs
            ><linearGradient
              id="_S_4_-gradient"
              x1="16"
              y1="12"
              x2="16"
              y2="28"
              gradientUnits="userSpaceOnUse"
              ><stop stop-color="#737373"></stop><stop
                offset="1"
                stop-color="#737373"
                stop-opacity="0"
              ></stop></linearGradient
            ></defs
          ></svg
        >
        <h3 class="mt-6 text-2xl font-semibold text-[oklch(58.8%_0.158_241.966)]">
          Instant Photo-to-Video Sync
        </h3>
        <p class="mt-2 text-base text-gray-700">
          Simply send us your video to us, and let Treasure of Memories bring
          them to life. Preserve every moment effortlessly, with no extra
          hassle.
        </p>
      </li>
      <li class="rounded-2xl border border-gray-200 p-8">
        <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
          ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
          ></circle><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5 4a4 4 0 014-4h14a4 4 0 014 4v10h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h5v2H9a4 4 0 01-4-4V4z"
            fill="#737373"
          ></path><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24 32a8 8 0 100-16 8 8 0 000 16zm1-8.414V19h-2v5.414l4 4L28.414 27 25 23.586z"
            fill="#171717"
          ></path></svg
        >
        <h3 class="mt-6 text-2xl font-semibold text-[oklch(58.8%_0.158_241.966)]">
          Bring the Magic to Life
        </h3>
        <p class="mt-2 text-base text-gray-700">
          Share your memories with loved ones. From wedding albums and travel
          diaries to your child’s milestones, Memories turns every moment into
          something truly unforgettable.
        </p>
      </li>
    </ul>
  </div>
</section>

<!-- 
-------------------Feature section 2--------------------- -->
<section
  id="features"
  aria-label="Features for investing all your money"
  class="bg-gray-900 py-20 sm:py-32"
>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div
      class="relative rounded-2xl transition-colors bg-gray-800 hover:bg-gray-800/30"
    >
      <div
        class="absolute inset-0"
        style="border-radius: 16px; opacity: 1;"
      ></div>

      <div class="relative z-10 p-8">
        <div class="flex gap-5">
          <div>
            <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
              ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
              ></circle><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
                fill="#737373"
              ></path><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
                fill="#A3A3A3"
              ></path></svg
            >
          </div>
          <div>
            <h2
              class="text-2xl md:text-3xl font-medium tracking-tight text-white"
            >
              Our Photo Frame Collections.
            </h2>
          </div>
        </div>
        <h3 class="mt-6 text-lg font-semibold text-white">
          <button
            class="text-left data-selected:not-data-focus:outline-hidden"
            id="headlessui-tabs-tab-_R_19dkluivb_"
            role="tab"
            type="button"
            aria-selected="true"
            tabindex="0"
            data-headlessui-state="selected"
            data-selected=""
            aria-controls="headlessui-tabs-panel-_R_3alkluivb_"
            ><span class="absolute inset-0 rounded-2xl"></span>Our Collections:</button
          >
        </h3>
        <p class="mt-2 py-2 text-gray-400">
          📸 Classic Grid Frames – Showcase multiple memories in one stylish
          layout.
        </p>
        <p class="mt-2 py-2 text-gray-400">
          🖼 Gallery Wall Frames – Create a stunning feature wall with your
          favorite photos.
        </p>
        <p class="mt-2 py-2 text-gray-400">
          🌳 Wooden Collage Frames – Add warmth and texture with handcrafted
          wooden designs.
        </p>
        <p class="mt-2 py-2 text-gray-400">
          📦 Wooden Box Frames – Unique depth and dimension to display keepsakes
          and photos.
        </p>
        <p class="mt-2 py-2 text-gray-400">
          💕 Candid Photo Frames – Capture spontaneous, joyful moments with a
          creative touch.
        </p>
        <p class="mt-2 py-2 text-gray-400">
          📖 Photo Albums – Preserve stories, adventures, and memories in
          beautifully crafted albums.
        </p>
      </div>
    </div>
  </div>

  <!-- mobile view section 2 -->
  <div class="mt-16 md:hidden">
    <div
      class="-mb-4 flex snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&amp;::-webkit-scrollbar]:hidden"
    >
      <div class="w-full flex-none snap-center px-4 sm:px-6">
        <div
          class="relative transform overflow-hidden rounded-2xl bg-gray-800 px-5 py-6"
        >
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              viewBox="0 0 558 558"
              width="558"
              height="558"
              fill="none"
              aria-hidden="true"
              ><defs
                ><linearGradient
                  id="_R_1b4luivb_"
                  x1="79"
                  y1="16"
                  x2="105"
                  y2="237"
                  gradientUnits="userSpaceOnUse"
                  ><stop stop-color="#13B5C8"></stop><stop
                    offset="1"
                    stop-color="#13B5C8"
                    stop-opacity="0"
                  ></stop></linearGradient
                ></defs
              ><path
                opacity=".2"
                d="M1 279C1 125.465 125.465 1 279 1s278 124.465 278 278-124.465 278-278 278S1 432.535 1 279Z"
                stroke="#13B5C8"
              ></path><path
                d="M1 279C1 125.465 125.465 1 279 1"
                stroke="url(#_R_1b4luivb_)"
                stroke-linecap="round"
              ></path></svg
            >
          </div>
          <div
            class="relative aspect-366/729 relative mx-auto w-full max-w-[366px]"
          >
            <div
              class="absolute inset-y-[calc(1/729*100%)] right-[calc(5/729*100%)] left-[calc(7/729*100%)] rounded-[calc(58/366*100%)/calc(58/729*100%)] shadow-2xl"
            ></div>
            <div
              class="absolute top-[calc(23/729*100%)] left-[calc(23/366*100%)] grid h-[calc(686/729*100%)] w-[calc(318/366*100%)] transform grid-cols-1 overflow-hidden bg-gray-900 pt-[calc(23/318*100%)]"
            >
              <div class="flex flex-col w-full">
                <iframe
                  width="100%"
                  height="500"
                  src={src3}
                  frameborder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <svg
              viewBox="0 0 366 729"
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 h-full w-full fill-gray-100"
              ><path
                fill="#F2F2F2"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M300.092 1c41.22 0 63.223 21.99 63.223 63.213V184.94c-.173.184-.329.476-.458.851.188-.282.404-.547.647-.791.844-.073 2.496.257 2.496 2.157V268.719c-.406 2.023-2.605 2.023-2.605 2.023a7.119 7.119 0 0 1-.08-.102v394.462c0 41.213-22.001 63.212-63.223 63.212h-95.074c-.881-.468-2.474-.795-4.323-.838l-33.704-.005-.049.001h-.231l-.141-.001c-2.028 0-3.798.339-4.745.843H66.751c-41.223 0-63.223-21.995-63.223-63.208V287.739c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 284.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-16.289c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 214.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-26.041a2.26 2.26 0 0 0 .093-.236l-.064-.01a3.337 3.337 0 0 1-.72-.12l-.166-.028A2 2 0 0 1 1 135.62v-24.611a2 2 0 0 1 1.671-1.973l.857-.143v-44.68C3.528 22.99 25.53 1 66.75 1h233.341ZM3.952 234.516a5.481 5.481 0 0 0-.229-.278c.082.071.159.163.228.278Zm89.99-206.304A4.213 4.213 0 0 0 89.727 24H56.864C38.714 24 24 38.708 24 56.852v618.296C24 693.292 38.714 708 56.864 708h250.272c18.15 0 32.864-14.708 32.864-32.852V56.852C340 38.708 325.286 24 307.136 24h-32.864a4.212 4.212 0 0 0-4.213 4.212v2.527c0 10.235-8.3 18.532-18.539 18.532H112.48c-10.239 0-18.539-8.297-18.539-18.532v-2.527Z"
              ></path><rect
                x="154"
                y="29"
                width="56"
                height="5"
                rx="2.5"
                fill="#D4D4D4"
              ></rect></svg
            >
          </div>
          <!-- <div
            class="absolute inset-x-0 bottom-0 bg-gray-800/95 p-6 backdrop-blur-sm sm:p-10"
          >
            <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
              ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
              ></circle><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
                fill="#737373"
              ></path><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
                fill="#A3A3A3"
              ></path></svg
            >
            <h3 class="mt-6 text-sm font-semibold text-white sm:text-lg">
              Invite friends for better returnsss
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              For every friend you invite to Pocket, you get insider
              notifications 5 seconds sooner. And it’s 10 seconds if you invite
              an insider.
            </p>
          </div> -->
        </div>
      </div>
    </div>

    <!-- steps 3 -->

    <div class="mx-6 mt-16">
      <h2 class="text-3xl font-medium tracking-tight text-white">
        How It Works
      </h2>
      <p class="mt-5 text-lg text-gray-400">Capture ➝ Customize ➝ Celebrate</p>
    </div>
    <div
      class="relative my-8 mx-0 z-10 order-last col-span-6 space-y-6"
      role="tablist"
      aria-orientation="vertical"
    >
      <div class="relative rounded-2xl transition-colors hover:bg-gray-800/30">
        <div
          class="absolute inset-0"
          style="border-radius: 16px; opacity: 1;"
        ></div>
        <div class="relative z-10 p-8">
          <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
            ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
            ></circle><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
              fill="#737373"
            ></path><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
              fill="#A3A3A3"
            ></path></svg
          >
          <h3 class="mt-6 text-lg font-semibold text-white">
            <button
              class="text-left data-selected:not-data-focus:outline-hidden"
              id="headlessui-tabs-tab-_R_19dkluivb_"
              role="tab"
              type="button"
              aria-selected="true"
              tabindex="0"
              data-headlessui-state="selected"
              data-selected=""
              aria-controls="headlessui-tabs-panel-_R_3alkluivb_"
              ><span class="absolute inset-0 rounded-2xl"></span>Choose your
              favorite frame style or album style</button
            >
          </h3>
          <p class="mt-2 text-sm text-gray-400">
            Personalize your memories by selecting from elegant frame styles or
            stylish album layouts that perfectly match your moments. Each design
            is crafted to highlight your photos in the most beautiful way.
            Choose the one that reflects your style and make every memory
            unforgettable.
          </p>
        </div>
      </div>

      <div class="relative rounded-2xl transition-colors hover:bg-gray-800/30">
        <div class="relative z-10 p-8">
          <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
            ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
            ></circle><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
              fill="#A3A3A3"
            ></path><path
              d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
              fill="#737373"
            ></path></svg
          >
          <h3 class="mt-6 text-lg font-semibold text-white">
            <button
              class="text-left data-selected:not-data-focus:outline-hidden"
              id="headlessui-tabs-tab-_R_1adkluivb_"
              role="tab"
              type="button"
              aria-selected="false"
              tabindex="-1"
              data-headlessui-state=""
              ><span class="absolute inset-0 rounded-2xl"></span>Share your
              memories with videos.</button
            >
          </h3>
          <p class="mt-2 text-sm text-gray-400">
            Bring your memories to life by sharing photos paired with videos.
            Relive every special moment in a more engaging and interactive way.
            Create a story that goes beyond a single picture and captures the
            true essence of your moments.
          </p>
        </div>
      </div>

      <div class="relative rounded-2xl transition-colors hover:bg-gray-800/30">
        <div class="relative z-10 p-8">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            class="h-8 w-8"
            ><defs
              ><linearGradient
                id="_R_rdkluivb_-gradient"
                x1="14"
                y1="14.5"
                x2="7"
                y2="17"
                gradientUnits="userSpaceOnUse"
                ><stop stop-color="#737373"></stop><stop
                  offset="1"
                  stop-color="#D4D4D4"
                  stop-opacity="0"
                ></stop></linearGradient
              ></defs
            ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
            ></circle><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5 4a4 4 0 014-4h14a4 4 0 014 4v13h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h4v2H9a4 4 0 01-4-4V4z"
              fill="#A3A3A3"
            ></path><path
              d="M7 22c0-4.694 3.5-8 8-8"
              stroke="url(#_R_rdkluivb_-gradient)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path><path
              d="M21 20l.217-5.513a1.431 1.431 0 00-2.85-.226L17.5 21.5l-1.51-1.51a2.107 2.107 0 00-2.98 0 .024.024 0 00-.005.024l3.083 9.25A4 4 0 0019.883 32H25a4 4 0 004-4v-5a3 3 0 00-3-3h-5z"
              fill="#A3A3A3"
            ></path></svg
          >
          <h3 class="mt-6 text-lg font-semibold text-white">
            <button
              class="text-left data-selected:not-data-focus:outline-hidden"
              id="headlessui-tabs-tab-_R_1bdkluivb_"
              role="tab"
              type="button"
              aria-selected="false"
              tabindex="-1"
              data-headlessui-state=""
              ><span class="absolute inset-0 rounded-2xl"></span>We create a
              frame that speaks your story with lifetime free access.</button
            >
          </h3>
          <p class="mt-2 text-sm text-gray-400">
            We create a frame that speaks your story with lifetime free access.
            Each frame is designed to reflect your emotions and preserve your
            memories. Your moments stay safe, accessible, and beautifully
            presented forever. A timeless way to cherish and share your story
            without limits.
          </p>
        </div>
      </div>

      <div class="relative rounded-2xl transition-colors hover:bg-gray-800/30">
        <div class="relative z-10 p-8">
          <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
            ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
            ></circle><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
              fill="#A3A3A3"
            ></path><path
              d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
              fill="#737373"
            ></path></svg
          >
          <h3 class="mt-6 text-lg font-semibold text-white">
            <button
              class="text-left data-selected:not-data-focus:outline-hidden"
              id="headlessui-tabs-tab-_R_1adkluivb_"
              role="tab"
              type="button"
              aria-selected="false"
              tabindex="-1"
              data-headlessui-state=""
              ><span class="absolute inset-0 rounded-2xl"></span>We craft and
              deliver you a perfect frame.</button
            >
          </h3>
          <p class="mt-2 text-sm text-gray-400">
            We craft and deliver your perfect frame with care and precision.
            Each piece is designed to showcase your memories in the most elegant
            way. From creation to delivery, we ensure quality at every step. A
            frame made just for you, ready to treasure forever.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- desktop section 2 -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 hidden md:mt-20 md:block">
    <div class="grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24">
      <div
        class="relative z-10 order-last col-span-6 space-y-6"
        role="tablist"
        aria-orientation="vertical"
      >
        <div class="mx-8 mt-16">
          <h2 class="text-3xl font-medium tracking-tight text-white">
            How It Works ?
          </h2>
          <p class="mt-8 mb-10 text-lg text-gray-400">
            Capture ➝ Customize ➝ Celebrate
          </p>
        </div>
        <div
          class="relative rounded-2xl transition-colors bg-gray-800 hover:bg-gray-800/30"
        >
          <div
            class="absolute inset-0"
            style="border-radius: 16px; opacity: 1;"
          ></div>

          <div class="relative z-10 p-8">
            <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
              ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
              ></circle><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
                fill="#737373"
              ></path><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
                fill="#A3A3A3"
              ></path></svg
            >
            <h3 class="mt-6 text-lg font-semibold text-white">
              <button
                class="text-left data-selected:not-data-focus:outline-hidden"
                id="headlessui-tabs-tab-_R_19dkluivb_"
                role="tab"
                type="button"
                aria-selected="true"
                tabindex="0"
                data-headlessui-state="selected"
                data-selected=""
                aria-controls="headlessui-tabs-panel-_R_3alkluivb_"
                ><span class="absolute inset-0 rounded-2xl"></span>Choose your
                favorite frame style or album style</button
              >
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              Personalize your memories by selecting from elegant frame styles
              or stylish album layouts that perfectly match your moments. Each
              design is crafted to highlight your photos in the most beautiful
              way. Choose the one that reflects your style and make every memory
              unforgettable.
            </p>
          </div>
        </div>

        <div
          class="relative rounded-2xl transition-colors hover:bg-gray-800/30"
        >
          <div class="relative z-10 p-8">
            <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
              ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
              ></circle><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
                fill="#A3A3A3"
              ></path><path
                d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
                fill="#737373"
              ></path></svg
            >
            <h3 class="mt-6 text-lg font-semibold text-white">
              <button
                class="text-left data-selected:not-data-focus:outline-hidden"
                id="headlessui-tabs-tab-_R_1adkluivb_"
                role="tab"
                type="button"
                aria-selected="false"
                tabindex="-1"
                data-headlessui-state=""
                ><span class="absolute inset-0 rounded-2xl"></span>Share your
                memories with videos.</button
              >
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              Bring your memories to life by sharing photos paired with videos.
              Relive every special moment in a more engaging and interactive
              way. Create a story that goes beyond a single picture and captures
              the true essence of your moments.
            </p>
          </div>
        </div>

        <div
          class="relative rounded-2xl transition-colors hover:bg-gray-800/30"
        >
          <div class="relative z-10 p-8">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              class="h-8 w-8"
              ><defs
                ><linearGradient
                  id="_R_rdkluivb_-gradient"
                  x1="14"
                  y1="14.5"
                  x2="7"
                  y2="17"
                  gradientUnits="userSpaceOnUse"
                  ><stop stop-color="#737373"></stop><stop
                    offset="1"
                    stop-color="#D4D4D4"
                    stop-opacity="0"
                  ></stop></linearGradient
                ></defs
              ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
              ></circle><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 4a4 4 0 014-4h14a4 4 0 014 4v13h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h4v2H9a4 4 0 01-4-4V4z"
                fill="#A3A3A3"
              ></path><path
                d="M7 22c0-4.694 3.5-8 8-8"
                stroke="url(#_R_rdkluivb_-gradient)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path><path
                d="M21 20l.217-5.513a1.431 1.431 0 00-2.85-.226L17.5 21.5l-1.51-1.51a2.107 2.107 0 00-2.98 0 .024.024 0 00-.005.024l3.083 9.25A4 4 0 0019.883 32H25a4 4 0 004-4v-5a3 3 0 00-3-3h-5z"
                fill="#A3A3A3"
              ></path></svg
            >
            <h3 class="mt-6 text-lg font-semibold text-white">
              <button
                class="text-left data-selected:not-data-focus:outline-hidden"
                id="headlessui-tabs-tab-_R_1bdkluivb_"
                role="tab"
                type="button"
                aria-selected="false"
                tabindex="-1"
                data-headlessui-state=""
                ><span class="absolute inset-0 rounded-2xl"></span>We create a
                frame that speaks your story with lifetime free access.</button
              >
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              We create a frame that speaks your story with lifetime free
              access. Each frame is designed to reflect your emotions and
              preserve your memories. Your moments stay safe, accessible, and
              beautifully presented forever. A timeless way to cherish and share
              your story without limits.
            </p>
          </div>
        </div>

        <div
          class="relative rounded-2xl transition-colors hover:bg-gray-800/30"
        >
          <div class="relative z-10 p-8">
            <svg viewBox="0 0 32 32" aria-hidden="true" class="h-8 w-8"
              ><circle cx="16" cy="16" r="16" fill="#A3A3A3" fill-opacity="0.2"
              ></circle><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
                fill="#A3A3A3"
              ></path><path
                d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
                fill="#737373"
              ></path></svg
            >
            <h3 class="mt-6 text-lg font-semibold text-white">
              <button
                class="text-left data-selected:not-data-focus:outline-hidden"
                id="headlessui-tabs-tab-_R_1adkluivb_"
                role="tab"
                type="button"
                aria-selected="false"
                tabindex="-1"
                data-headlessui-state=""
                ><span class="absolute inset-0 rounded-2xl"></span>We craft and
                deliver you a perfect frame.</button
              >
            </h3>
            <p class="mt-2 text-sm text-gray-400">
              We craft and deliver your perfect frame with care and precision.
              Each piece is designed to showcase your memories in the most
              elegant way. From creation to delivery, we ensure quality at every
              step. A frame made just for you, ready to treasure forever.
            </p>
          </div>
        </div>
      </div>
      <div class="relative col-span-6">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <svg
            viewBox="0 0 558 558"
            width="558"
            height="558"
            fill="none"
            aria-hidden="true"
            class="animate-spin-slower"
            ><defs
              ><linearGradient
                id="_R_1lkluivb_"
                x1="79"
                y1="16"
                x2="105"
                y2="237"
                gradientUnits="userSpaceOnUse"
                ><stop stop-color="#13B5C8"></stop><stop
                  offset="1"
                  stop-color="#13B5C8"
                  stop-opacity="0"
                ></stop></linearGradient
              ></defs
            ><path
              opacity=".2"
              d="M1 279C1 125.465 125.465 1 279 1s278 124.465 278 278-124.465 278-278 278S1 432.535 1 279Z"
              stroke="#13B5C8"
            ></path><path
              d="M1 279C1 125.465 125.465 1 279 1"
              stroke="url(#_R_1lkluivb_)"
              stroke-linecap="round"
            ></path></svg
          >
        </div>
        <div class="relative aspect-366/729 z-10 mx-auto w-full max-w-[366px]">
          <div
            class="absolute inset-y-[calc(1/729*100%)] right-[calc(5/729*100%)] left-[calc(7/729*100%)] rounded-[calc(58/366*100%)/calc(58/729*100%)] shadow-2xl"
          ></div>
          <div
            class="absolute top-[calc(23/729*100%)] left-[calc(23/366*100%)] grid h-[calc(686/729*100%)] w-[calc(318/366*100%)] transform grid-cols-1 overflow-hidden bg-gray-900 pt-[calc(23/318*100%)]"
          >
            <div
              class="col-start-1 row-start-1 flex focus:outline-offset-32 data-selected:not-data-focus:outline-hidden"
              id="headlessui-tabs-panel-_R_3alkluivb_"
              role="tabpanel"
              tabindex="0"
              data-headlessui-state="selected"
              data-selected=""
              aria-labelledby="headlessui-tabs-tab-_R_19dkluivb_"
            >
              <iframe
                width="100%"
                height="500"
                src={src3}
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <svg
            viewBox="0 0 366 729"
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 h-full w-full fill-gray-100"
            ><path
              fill="#F2F2F2"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M300.092 1c41.22 0 63.223 21.99 63.223 63.213V184.94c-.173.184-.329.476-.458.851.188-.282.404-.547.647-.791.844-.073 2.496.257 2.496 2.157V268.719c-.406 2.023-2.605 2.023-2.605 2.023a7.119 7.119 0 0 1-.08-.102v394.462c0 41.213-22.001 63.212-63.223 63.212h-95.074c-.881-.468-2.474-.795-4.323-.838l-33.704-.005-.049.001h-.231l-.141-.001c-2.028 0-3.798.339-4.745.843H66.751c-41.223 0-63.223-21.995-63.223-63.208V287.739c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 284.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-16.289c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 214.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-26.041a2.26 2.26 0 0 0 .093-.236l-.064-.01a3.337 3.337 0 0 1-.72-.12l-.166-.028A2 2 0 0 1 1 135.62v-24.611a2 2 0 0 1 1.671-1.973l.857-.143v-44.68C3.528 22.99 25.53 1 66.75 1h233.341ZM3.952 234.516a5.481 5.481 0 0 0-.229-.278c.082.071.159.163.228.278Zm89.99-206.304A4.213 4.213 0 0 0 89.727 24H56.864C38.714 24 24 38.708 24 56.852v618.296C24 693.292 38.714 708 56.864 708h250.272c18.15 0 32.864-14.708 32.864-32.852V56.852C340 38.708 325.286 24 307.136 24h-32.864a4.212 4.212 0 0 0-4.213 4.212v2.527c0 10.235-8.3 18.532-18.539 18.532H112.48c-10.239 0-18.539-8.297-18.539-18.532v-2.527Z"
            ></path><rect
              x="154"
              y="29"
              width="56"
              height="5"
              rx="2.5"
              fill="#D4D4D4"
            ></rect></svg
          >
        </div>
      </div>
    </div>
  </div>
</section>

<!-- section 3  -->


<!-- section 4 -->
<section
  id="get-free-shares-today"
  class="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
>
  <div
    class="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2"
  >
    <svg
      viewBox="0 0 558 558"
      width="558"
      height="558"
      fill="none"
      aria-hidden="true"
      class="animate-spin-slower sr-only sm:not-sr-only"
      ><defs
        ><linearGradient
          id="_S_5_"
          x1="79"
          y1="16"
          x2="105"
          y2="237"
          gradientUnits="userSpaceOnUse"
          ><stop stop-color="#fff"></stop><stop
            offset="1"
            stop-color="#fff"
            stop-opacity="0"
          ></stop></linearGradient
        ></defs
      ><path
        opacity=".2"
        d="M1 279C1 125.465 125.465 1 279 1s278 124.465 278 278-124.465 278-278 278S1 432.535 1 279Z"
        stroke="#fff"
      ></path><path
        d="M1 279C1 125.465 125.465 1 279 1"
        stroke="url(#_S_5_)"
        stroke-linecap="round"
      ></path></svg
    >
  </div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
    <div class="mx-auto max-w-md sm:text-center">
      <h2 class="text-3xl font-medium tracking-tight text-white sm:text-4xl">
        Why Choose Us ?
      </h2>
      <p class="mt-4 text-lg text-gray-300">
        ✔ Designed for lasting beauty and durability
      </p>
       <p class="mt-4 text-lg text-gray-300">
         ✔ Perfect for home decor and gifts for every occasion
      </p>
       <p class="mt-4 text-lg text-gray-300">
        ✔ Easy customization and hassle-free ordering
      </p>
       <p class="mt-4 text-lg text-gray-300">
       ✔ Crafted with care and attention to detail
      </p>
      <div class="mt-8 flex justify-center">
        
      </div>
    </div>
  </div>
</section>


<!-- section5 -->
<Comments/>
<style>
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 300px; /* Shorts look better with narrow width */
    aspect-ratio: 9 / 16; /* Keeps vertical format */
    margin: auto;
    border-radius: 12px;
  }
</style>
