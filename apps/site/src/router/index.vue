<template>
  <div class="min-h-screen h-full w-full bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-700">
    <div class="flex flex-col md:flex-row justify-center items-center">
      <div class="flex flex-col">
        <h1 class="text-4xl prose text-white py-4 font-semibold">WindyOTP</h1>
        <h2 class="text-2xl prose text-neutral-300">Your personal otp experience</h2>
        <div class="block md:hidden w-4/5 mx-auto">
          <PhoneDisplay />
        </div>
        <div class="flex flex-row pt-8 justify-evenly">
          <a class="border-b-2 border-spacing-2 border-lime-400 text-white"
            href="https://github.com/robbryandev/WindyOTP/releases">Download</a>
          <a class="border-b-2 border-spacing-2 border-lime-400 text-white"
            href="https://github.com/robbryandev/WindyOTP">Github</a>
        </div>
      </div>
      <div class="relative top-20 left-20 md:block hidden">
        <PhoneDisplay />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PhoneDisplay from '@/components/PhoneDisplay.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    PhoneDisplay: PhoneDisplay
  }
});
</script>
