<template>
  <p class="inline-block min-w-0" :class="class">
    <span className="font-semibold truncate block">
      {{ text }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useResizeObserver } from "@vueuse/core";

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
