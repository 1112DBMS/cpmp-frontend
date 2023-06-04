<template>
  <div class="h-full flex flex-col gap-2 my-2 p-2 lg:p-0">
    <div v-if="loading" class="h-full flex justify-center align-middle">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <h2 class="text-2xl font-bold mx-2" v-else>{{ user.isLoggedin ? "My Top 10" : "Top 10" }}</h2>
    <ScrollFrame v-if="!loading">
      <Card
        v-for="track in result"
        :key="track.id"
        :track="track"
        @handleEnqueue="handleSelect"
      />
    </ScrollFrame>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchApi } from "../utils/api";
import { useUserStore } from "../store/user";
import Card from "../components/Card.vue";
import ScrollFrame from "../components/ScrollFrame.vue";

const user = useUserStore();
const loading = ref(false);
const result = ref<Track[]>([]);

const init = async () => {
  result.value = [];
  loading.value = true;
  const response = await fetchApi("/top", "get", {
    params: {
      self: user.isLoggedin ? 1 : undefined,
    },
  });
  loading.value = false;
  console.log(response);
  result.value = response.data.data.list;
};

const handleSelect = (track: Track) => {
  result.value = result.value.map((t) => (t.id === track.id ? track : t));
};

onMounted(() => init());

watch(
  () => user.isLoggedin,
  () => init()
);
</script>
