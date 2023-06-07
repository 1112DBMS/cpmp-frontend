<template>
  <p
    class="inline-block min-w-0 overflow-auto auto-scroll-container"
    ref="el"
    :class="class"
  >
    <span class="w-full whitespace-nowrap">
      {{ text }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { useScroll } from "@vueuse/core";
import { onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    text?: string | number;
    class?: string;
  }>(),
  {
    text: "",
    class: "",
  }
);

const el = ref();
const timer = ref(-1);
const { x, y, arrivedState } = useScroll(el);

const timerFunc = () =>
  window.setInterval(() => {
    x.value += 0.35;
    if (arrivedState.right) {
      window.clearInterval(timer.value);
      window.setTimeout(() => {
        x.value = 0;
        window.setTimeout(() => {
          timer.value = timerFunc();
        }, 2000);
      }, 2000);
    }
  }, 25);

onMounted(() => {
  timer.value = timerFunc();
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.auto-scroll-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.auto-scroll-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
