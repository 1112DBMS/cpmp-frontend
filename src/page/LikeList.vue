<template>
  <div class="h-full flex flex-col gap-2 my-2 p-2 lg:p-0">
    <div v-if="loading" class="h-full flex justify-center align-middle">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <h2 class="text-2xl font-bold mx-2" v-else>Like List</h2>
    <ScrollFrame v-if="!loading">
      <Card
        v-for="track in likeList"
        :key="track.id"
        :track="track"
        @handleLike="handleLike"
      />
    </ScrollFrame>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchApi } from "../utils/api";
import { useUserStore } from "../store/user";
import { useLike } from "../store/like";
import Card from "../components/Card.vue";
import ScrollFrame from "../components/ScrollFrame.vue";
import { storeToRefs } from "pinia";

const user = useUserStore();
const like = useLike();

const { loading, likeList } = storeToRefs(like);

const init = async () => {
  like.getList();
};

const handleLike = (track: Track) => {
  init();
};

onMounted(() => init());

watch(
  () => user.isLoggedin,
  () => init()
);
</script>
