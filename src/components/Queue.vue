<template>
  <div class="h-full flex flex-col">
    <div class="px-2 mt-2" v-if="nowPlaying">
      <h2 class="text-2xl font-bold">Now playing</h2>
      <Card :track="player.track" :enqueue="false" queue remove @handleLike="handleLike" :index="0" />
    </div>

    <div
      class="flex flex-col gap-2 relative grow rounded-2xl"
      id="queue-container"
    >
      <div class="px-2 pt-1">
        <h2 class="text-2xl font-bold">Queue</h2>
        <Card
          v-for="(track, i) in player.queue"
          :key="track.id"
          :track="track"
          :enqueue="false"
          queue
          remove
          :index="i + 1"
        />
        <div v-if="player.queue.length === 0">
          <Card>
            <template v-slot:fallback> Empty queue </template>
          </Card>
        </div>
      </div>
    </div>

    <Teleport to="#queue-container" v-if="!user.isLoggedin">
      <div
        class="absolute top-0 h-full w-full flex items-center justify-center overflow-hidden bg-[#0000005c] rounded-2xl"
      >
        <h2 class="text-2xl font-bold">Login first</h2>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePlayer } from "../store/player";
import { useUserStore } from "../store/user";
import Card from "../components/Card.vue";

const props = withDefaults(
  defineProps<{
    nowPlaying?: boolean
  }>(),
  {
    nowPlaying: true,
  }
);

const player = usePlayer();
const user = useUserStore();

const handleLike = () => {
  player.getQueue()
}
</script>
