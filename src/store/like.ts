import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchApi } from "../utils/api";

export const useLike = defineStore("like", () => {
  const loading = ref(false);
  const likeList = ref<Track[]>([]);

  const getList = async () => {
    loading.value = true;
    const response = await fetchApi("/like", "get");
    loading.value = false;
    likeList.value = response.data.data.list;
  };

  return { loading, likeList, getList };
});
