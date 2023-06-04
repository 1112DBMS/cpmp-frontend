<template>
  <div class="h-full flex justify-center align-middle">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchApi } from "../utils/api";

const routes = useRoute();
const router = useRouter();

const init = async () => {
  const { code, state } = routes.query;
  const response = await fetchApi("/oauth", "get", {
    params: {
      code,
    },
  });
  router.push(state as string);
};

onMounted(() => init());
</script>
