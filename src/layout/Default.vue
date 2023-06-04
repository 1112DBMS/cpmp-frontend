<template>
  <div class="flex flex-col h-full">
    <div class="navbar bg-base-100 shrink-0 gap-4 items-center">
      <RouterLink to="/" class="btn btn-ghost normal-case text-xl">
        CPMP
      </RouterLink>
      <div class="grow">
        <SearchBar />
      </div>
      <LoginButton />
    </div>
    <div class="grow min-h-0 overflow-hidden lg:p-4">
      <div class="flex gap-8 h-full">
        <div
          class="shrink-0 lg:w-96 xl:w-[28rem] card card-compact shadow-xl hidden lg:block"
        >
          <div class="lg:card-body h-full">
            <div class="overflow-auto h-full">
              <Queue />
            </div>
          </div>
        </div>
        <div class="grow lg:card card-compact lg:shadow-xl">
          <div class="lg:card-body h-full">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
    <div class="shrink-0">
      <Player />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import LoginButton from "../components/LoginButton.vue";
import Player from "../components/Player.vue";
import SearchBar from "../components/SearchBar.vue";
import { useUserStore } from "../store/user";
import { usePlayer } from "../store/player";
import Queue from "../components/Queue.vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);

const mobile = breakpoints.smaller("lg");

const user = useUserStore();
const player = usePlayer();

const trackId = ref("UsxpKpmGXVI");

onMounted(() => {
  user.getProfile();
});
</script>
