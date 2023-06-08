<template>
  <Vue3Marquee :delay="1" :duration="text.length" pauseOnHover :class="class">
    {{ text }}
  </Vue3Marquee>
</template>

<script setup lang="ts">
import { Vue3Marquee } from "vue3-marquee";
import "vue3-marquee/dist/style.css";

const props = withDefaults(
  defineProps<{
    text?: string;
    class?: string;
  }>(),
  {
    text: "",
    class: "",
  }
);
</script>

<style scoped>
@keyframes scroll {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
}

.auto-scroll-text {
  animation: scroll 10s;
}
</style>
