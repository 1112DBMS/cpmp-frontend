<template>
  <form @submit.prevent="handleSearch" class="w-full">
    <input
      type="text"
      placeholder="Search"
      class="input input-bordered w-full"
      v-model="keyword"
    />
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const routes = useRoute();
const keyword = ref(routes.query.keyword || "");

const handleSearch = () => {
  router.push({
    name: "Search",
    query: {
      keyword: keyword.value,
    },
  });
};
</script>
