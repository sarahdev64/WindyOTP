<template>
  <div class="base relative">
    <img class="absolute z-20 top-0 left-0" src="/phone/phone.png" alt="phone base"/>
    <div class="absolute top-0 left-0 rounded-4xl z-10 overflow-hidden w-50 h-100 p-2">
      <img class="z-10 object-fit w-50 h-98 object-top-left" :src="phoneDisplayUrl" alt="phone screenshot"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {displays} from "@/data/displays.ts";

const props = defineProps<{
  display?: string
}>();

const phoneDisplayKey: string = props.display?.valueOf() ?? "main";
const phoneDisplayUrl: string = Object.hasOwn(displays, phoneDisplayKey)
  ? displays[phoneDisplayKey]!.path : displays["main"]!.path;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.base {
  width: 200px;
  height: 300px;
  margin: 40px;
}
</style>
