<template>
  <div class="min-h-0 h-full overflow-hidden" :class="className">
    <div class="overflow-y-auto overflow-x-hidden h-full" :class="innerClass" ref="el">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    class?: string;
    innerClass?: string;
  }>(),
  {
    class: "",
    innerClass: "",
  }
);

const el = ref();

const className = computed(() => props.class);

defineExpose({ el });
</script>
