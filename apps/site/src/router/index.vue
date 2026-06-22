<template>
  <div>
    <div class="min-h-full h-180 w-full flex flex-col md:flex-row justify-center items-center md:gap-44 bg-linear-to-br from-neutral-950 via-neutral-800 to-neutral-700">
        <div class="w-56 shrink text-center text-neutral-100 md:text-left">
          <h1 class="text-4xl prose py-4 font-semibold">WindyOTP</h1>
          <h2 class="text-2xl prose">Your personal otp experience</h2>

          <div class="flex flex-row pt-8 justify-center md:justify-start gap-8">
            <a class="border-b-2 border-spacing border-b-danger"
               href="https://github.com/sarahdev64/WindyOTP/releases">Download</a>
            <a class="border-b-2 border-spacing-2"
               href="https://github.com/sarahdev64/WindyOTP">Github</a>
          </div>
        </div>
      <PhoneDisplay display="main" />
    </div>
    <div class="min-h-screen h-full w-full bg-neutral-100">
      <div class="text-center w-200 mx-auto">
        <h1 class="text-4xl prose py-4 font-semibold uppercase">features</h1>
        <Carousel v-bind="carouselConfig">
          <Slide v-for="slide in 4" :key="slide">
            <div class="flex flex-row justify-center items-center my-20">
              <PhoneDisplay :display="Object.keys(displays)[slide - 1]" />
              <div class="text-left w-80">
                <p v-if="displayData.length >= slide
                  && typeof displayData[slide - 1]![1]?.summary !== `undefined`">{{displayData[slide - 1]![1]?.summary}}</p>
                <p v-else>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata</p>
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import {displays, type PhoneDisplayData} from "@/data/displays.ts";
import PhoneDisplay from "@/components/PhoneDisplay.vue";

const carouselConfig = {
  itemsToShow: 1,
  autoplay: 5_000,
  wrapAround: true,
  pauseAutoplayOnHover: true,
}

const displayData: [string, PhoneDisplayData][] = Object.entries(displays);
</script>
