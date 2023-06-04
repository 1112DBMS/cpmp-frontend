import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { fetchApi } from "../utils/api";
import { usePlayer } from "./player";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null | undefined>(undefined);

  const isReady = computed(() => user.value !== undefined);

  const isLoggedin = computed(() => user.value !== null);

  const getProfile = async () => {
    const response = await fetchApi("/profile", "get");
    user.value = response.data.data;
    const player = usePlayer();
    await player.getQueue();
  };

  const logout = async () => {
    const response = await fetchApi("/logout", "get");
    getProfile();
  };

  return { user, getProfile, isReady, isLoggedin, logout };
});
