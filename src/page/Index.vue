<template>
  <div class="h-full flex flex-col gap-2 my-2 p-2 lg:p-0">
    <div class="flex gap-2 items-center">
      <button class="btn text-xl mx-2" @click="toggleSelf = !toggleSelf">
        {{ self ? "My Top 10" : "Top 10" }}
      </button>
      <dropdown-menu with-dropdown-closer direction="right" :overlay="false">
        <template #trigger>
          <label tabindex="0" class="btn">
            {{ timeString(timeRange) }}
          </label>
        </template>
        <template #body>
          <div tabindex="0" class="p-2 bg-base-100">
            <div class="card-body flex flex-col gap-2">
              <button
                class="btn"
                dropdown-closer
                @click="() => handleSelectTime(0)"
              >
                {{ timeString(0) }}
              </button>
              <button
                class="btn"
                dropdown-closer
                @click="() => handleSelectTime(24)"
              >
                {{ timeString(24) }}
              </button>
              <button
                class="btn"
                dropdown-closer
                @click="() => handleSelectTime(72)"
              >
                {{ timeString(72) }}
              </button>
              <button
                class="btn"
                dropdown-closer
                @click="() => handleSelectTime(168)"
              >
                {{ timeString(168) }}
              </button>
              <button
                class="btn"
                dropdown-closer
                @click="() => handleSelectTime(720)"
              >
                {{ timeString(720) }}
              </button>
            </div>
          </div>
        </template>
      </dropdown-menu>
    </div>
    <div v-if="loading" class="h-full flex justify-center align-middle">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <ScrollFrame v-if="!loading">
      <Card
        v-for="track in result"
        :key="track.id"
        :track="track"
        @handleEnqueue="handleSelect"
        @handleLike="handleLike"
      />
    </ScrollFrame>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchApi } from "../utils/api";
import { useUserStore } from "../store/user";
import Card from "../components/Card.vue";
import ScrollFrame from "../components/ScrollFrame.vue";
import DropdownMenu from "v-dropdown-menu";

const user = useUserStore();
const loading = ref(false);
const result = ref<Track[]>([]);
const timeRange = ref(24);
const toggleSelf = ref(true);

const init = async () => {
  result.value = [];
  loading.value = true;
  const response = await fetchApi("/top", "get", {
    params: {
      self: self.value ? 1 : undefined,
      time: timeRange.value,
    },
  });
  loading.value = false;
  console.log(response);
  result.value = response.data.data.list;
};

const handleSelect = (track: Track) => {
  result.value = result.value.map((t) => (t.id === track.id ? track : t));
};

const handleLike = (track: Track) => {
  result.value = result.value.map((t) => (t.id === track.id ? track : t));
};

const handleSelectTime = (t: number) => {
  timeRange.value = t;
};

const self = computed(() => {
  return toggleSelf.value && user.isLoggedin;
});

const timeString = computed(() => {
  return (t: number) => {
    switch (t) {
      case 24:
        return "24h";
      case 72:
        return "3d";
      case 168:
        return "7d";
      case 720:
        return "1m";
      case 0:
      default:
        return "unlimited";
    }
  };
});

onMounted(() => init());

watch(timeRange, () => init());

watch(self, () => init());
</script>
