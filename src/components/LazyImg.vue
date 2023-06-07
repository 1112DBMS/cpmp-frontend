<template>
  <div class="_image_wrapper relative">
    <template v-if="!ready">
      <div
        class="absolute h-full w-full top-0 left-0 flex justify-center items-center"
      >
        <span class="loading loading-spinner"></span>
      </div>
      <img class="absolute" :class="className" :src="placeholderImg" />
    </template>
    <img
      :class="[className]"
      class="select-none pointer-events-none"
      :data-src="src"
      @load="ready = true"
      ref="el"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
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

const el = ref();
const ready = ref(false);
const className = computed(() => props.class);

const onEnterView: IntersectionObserverCallback = (entries, observer) => {
  for (let entry of entries) {
    if (entry.isIntersecting) {
      // 監視目標進入畫面
      const img = entry.target;
      img.setAttribute("src", (img as any).dataset.src); // 把值塞回 src
      img.removeAttribute("data-src");
      observer.unobserve(img); // 取消監視
    }
  }
};

const watcher = ref(new IntersectionObserver(onEnterView));

onMounted(() => {
  watcher.value.observe(el.value);
});

watch(
  () => props.src,
  (value) => {
    ready.value = false;
    el.value.removeAttribute("src");
    el.value.setAttribute("data-src", value); // 把值塞回 src
    watcher.value.observe(el.value);
  }
);
</script>
