<template>
  <div v-if="user.isReady">
    <a
      class="btn btn-ghost normal-case"
      :href="loginUrl"
      v-if="!user.isLoggedin"
    >
      login
    </a>
    <dropdown-menu
      with-dropdown-closer
      direction="right"
      :overlay="false"
      v-else
    >
      <template #trigger>
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-12 rounded-full">
            <img :src="`/public/${user.user?.avatar}`" />
          </div>
        </label>
      </template>
      <template #body>
        <div
          tabindex="0"
          class="p-2 bg-base-100"
        >
          <div class="card-body flex flex-col gap-2">
            <h3 class="card-title">{{ user.user?.username }}</h3>
            <p>{{ user.user?.email }}</p>
            <button @click="() => toggleDark()" class="btn btn-ghost btn-sm">
              <Icon
                :icon="
                  isDark
                    ? 'material-symbols:sunny-rounded'
                    : 'material-symbols:mode-night-rounded'
                "
                class="text-2xl"
              />
            </button>
            <button @click="user.logout" class="btn btn-ghost btn-sm">
              Logout
            </button>
          </div>
        </div>
      </template>
    </dropdown-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/user";
import { useDark, useToggle } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import DropdownMenu from "v-dropdown-menu";

const user = useUserStore();
const routes = useRoute();

const isDark = useDark({
  attribute: "data-theme",
  valueLight: "light",
});
const toggleDark = useToggle(isDark);

const loginUrl = computed(() => {
  return `https://discord.com/oauth2/authorize?response_type=code&client_id=${
    import.meta.env.VITE_DISCORD_CLIENTID
  }&scope=identify%20email&state=${routes.fullPath}&redirect_uri=${
    window.location.origin
  }/oauthCallback&prompt=consent`;
});
</script>

<style>
.v-dropdown-menu__container {
  @apply card card-compact shadow-2xl absolute
}
</style>