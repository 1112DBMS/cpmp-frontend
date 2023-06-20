<template>
  <div class="h-full flex flex-col gap-2 my-2 p-2 lg:p-0">
    <div v-if="loading" class="h-full flex justify-center align-middle">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <h2 class="text-2xl font-bold mx-2" v-else>
      Search result for "{{ routes.query.keyword }}"
    </h2>
    <div class="grow min-h-0 h-full overflow-hidden" v-if="!loading">
      <div class="overflow-y-auto overflow-x-hidden h-full" ref="el">
        <div class="flex flex-col w-full">
          <Card
            v-for="track in result"
            :key="track.id"
            :track="track"
            @handleEnqueue="handleSelect"
            @handleLike="handleLike"
          />
          <div
            v-if="result.length === 0"
            class="w-full h-full flex items-center justify-center text-xl font-semibold"
          >
            No Data
          </div>
        </div>

        <div class="flex justify-center my-4" v-if="infiniteLoading">
          <span class="loading loading-spinner loading-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchApi } from "../utils/api";
import { usePlayer } from "../store/player";
import { useUserStore } from "../store/user";
import { Icon } from "@iconify/vue";
import Card from "../components/Card.vue";
import { useInfiniteScroll } from "@vueuse/core";

const player = usePlayer();
const user = useUserStore();
const routes = useRoute();
const loading = ref(false);
const infiniteLoading = ref(false);
const el = ref<HTMLElement>();
const result = ref<Track[]>([]);

useInfiniteScroll(
  el,
  async () => {
    if (result.value.length === 0 || result.value.length > 30) return;
    infiniteLoading.value = true;
    const response = await fetchApi("/search", "post", {
      data: {
        keyword: routes.query.keyword,
        platform: routes.query.platform,
        offset: result.value.length,
        len: 10,
      },
    });
    result.value = [
      ...new Map(
        [...result.value, ...response.data.data.list].map((item: Track) => [
          item.id,
          item,
        ])
      ).values(),
    ];
    infiniteLoading.value = false;
  },
  { distance: 2, interval: 1000 }
);

const init = async () => {
  result.value = [];
  loading.value = true;
  const response = await fetchApi("/search", "post", {
    data: {
      keyword: routes.query.keyword,
      platform: routes.query.platform,
    },
  });
  loading.value = false;
  result.value = response.data.data.list;
};

const handleSelect = (track: Track) => {
  result.value = result.value.map((t) => (t.id === track.id ? track : t));
};

const handleLike = (track: Track) => {
  result.value = result.value.map((t) => (t.id === track.id ? track : t));
};

onMounted(() => init());

watch(
  () => routes.query.keyword,
  () => init()
);

watch(
  () => routes.query.platform,
  () => init()
);
</script>
