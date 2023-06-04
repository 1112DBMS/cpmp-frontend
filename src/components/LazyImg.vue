<template>
  <div class="_image_wrapper relative" :class="className">
    <template v-if="!ready">
      <div
        class="absolute h-full w-full top-0 left-0 flex justify-center items-center"
      >
        <span class="loading loading-spinner"></span>
      </div>
      <img :src="placeholderImg" />
    </template>
    <img :src="src" @load="ready = true" v-show="ready" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import placeholderImg from "../assets/placeholder.png";

const props = withDefaults(
  defineProps<{
    class: string;
    src: string;
  }>(),
  {
    class: "max-w-[5rem]",
    src: "",
  }
);

const ready = ref(false);
const className = computed(() => props.class);
watch(
  () => props.src,
  () => (ready.value = false)
);
</script>
