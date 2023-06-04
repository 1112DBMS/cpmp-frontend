<template>
  <div
    class="bg-base-100"
    :disabled="realLoading"
    :loading="realLoading"
    v-if="track"
  >
    <div class="flex gap-6 items-center p-4">
      <LazyImg
        :src="`/public/${track?.thumbnail}`"
        class="aspect-auto"
        :class="mobile ? 'w-[5rem]' : 'w-[6rem]'"
      />
      <div class="flex flex-col gap-2 grow overflow-hidden justify-center">
        <div class="flex gap-2">
          <h2 class="inline-block min-w-0 grow self-center">
            <span class="truncate block font-bold">{{ track.title }}</span>
          </h2>
          <div class="flex gap-2">
            <button class="btn btn-circle" @click="open = true" v-if="mobile">
              <Icon
                icon="material-symbols:queue-music-rounded"
                class="text-2xl"
              />
            </button>
            <button
              class="btn btn-circle"
              v-if="!mobile"
              @click="handleToggleLoop"
              :disabled="player.loopLoading"
            >
              <Icon
                :icon="
                  player.loop === 2
                    ? 'material-symbols:repeat-one-rounded'
                    : 'material-symbols:repeat-rounded'
                "
                class="text-2xl"
                :class="{ 'opacity-30': !player.loop }"
              />
            </button>
            <button
              class="btn btn-circle"
              @click="handlePlay"
              :disabled="loading"
            >
              <span class="loading loading-spinner" v-if="loading"></span>
              <Icon
                v-else
                :icon="
                  !playing
                    ? 'material-symbols:play-arrow-rounded'
                    : 'material-symbols:pause-rounded'
                "
                class="text-2xl"
              />
            </button>
            <button
              class="btn btn-circle"
              @click="handleNext"
              :disabled="!user.isLoggedin || loading"
            >
              <Icon
                icon="material-symbols:skip-next-rounded"
                class="text-2xl"
              />
            </button>
            <button
              class="btn btn-circle"
              v-if="!mobile"
              @click="handleToggleShuffle"
            >
              <Icon
                icon="material-symbols:shuffle-outline-rounded"
                class="text-2xl"
              />
            </button>
          </div>
        </div>

        <div class="flex gap-2" v-if="!mobile">
          <span>{{ formatTime(isDragging ? tmpTime : time) }}</span>
          <input
            type="range"
            min="0"
            :max="duration"
            :value="isDragging ? tmpTime : time"
            @input="handleStart"
            @change="handleEnd"
            class="range range-xs range-primary"
          />
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
      <div
        class="self-center max-w-[150px] flex items-center gap-2"
        v-if="!mobile"
      >
        <Icon icon="material-symbols:volume-up-rounded" class="text-3xl" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          class="range range-xs range-primary"
        />
      </div>
    </div>
    <progress
      class="progress progress-primary absolute bottom-0"
      :max="duration"
      :value="time"
      v-if="mobile"
    />
  </div>
  <Modal :open="open" @handleClose="open = false">
    <template v-slot:modal>
      <div class="w-[100vw] h-[100vh] max-h-[500px] max-w-2xl">
        <div class="card py-4 bg-base-100 shadow rounded-2xl m-4 h-full">
          <ScrollFrame>
            <Queue />
          </ScrollFrame>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Howl } from "howler";
import { ref, onUnmounted, watch, computed } from "vue";
import { usePlayer } from "../store/player";
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import Modal from "./Modal.vue";
import Queue from "./Queue.vue";
import LazyImg from "./LazyImg.vue";
import ScrollFrame from "./ScrollFrame.vue";

const emits = defineEmits(["handleEnd"]);
const player = usePlayer();
const user = useUserStore();
const breakpoints = useBreakpoints(breakpointsTailwind);

const mobile = breakpoints.smaller("lg");

const sound = ref<Howl | null>(null);
const playing = ref(false);
const timer = ref(-1);
const time = ref(0);
const tmpTime = ref(0);
const volume = ref(0.5);
const duration = ref(0);
const loading = ref(false);
const isDragging = ref(false);
const open = ref(false);
const { track, loop, loading: downloadLoading } = storeToRefs(player);

const realLoading = computed(() => loading.value || downloadLoading.value);

const realVolume = computed(() => Math.pow(volume.value, 2.3) * 0.7);

const handlePlay = () => {
  if (!sound.value) {
    loading.value = true;
    sound.value = new Howl({
      src: `/api/play?id=${track.value?.id}`,
      format: "webm",
      volume: realVolume.value,
      autoplay: true,
      html5: true,
      onload: () => {
        duration.value = sound.value?.duration() || 0;
        loading.value = false;
      },
      onloaderror: () => {
        loading.value = false;
      },
      onplay: () => {
        playing.value = true;
        document.title = track.value?.title || "";
        timer.value = window.setInterval(() => {
          time.value = sound.value?.seek() || 0;
        }, 100);
      },
      onpause: () => {
        playing.value = false;
        window.clearInterval(timer.value);
      },
      onend: () => {
        playing.value = false;
        window.clearInterval(timer.value);
        player.next();
        emits("handleEnd");
      },
    });
  }
  if (playing.value) {
    sound.value.pause();
  } else {
    sound.value.play();
  }
};

const handleNext = async () => {
  loading.value = true;
  await player.next();
  loading.value = false;
};

const handleToggleLoop = () => {
  player.toggleLoop();
};

const handleToggleShuffle = () => {
  player.toggleShuffle();
};

const handleStart = (e: Event) => {
  isDragging.value = true;
  window.clearInterval(timer.value);
  tmpTime.value = parseFloat((e.target as HTMLInputElement).value);
};

const handleEnd = (e: Event) => {
  e.preventDefault();
  const _time = parseInt((e.target as any).value as string);
  if (sound.value?.playing()) {
    timer.value = window.setInterval(() => {
      time.value = sound.value?.seek() || 0;
    }, 100);
  } else {
    time.value = _time;
  }
  sound.value?.seek(_time);
  window.setTimeout(() => (isDragging.value = false), 200);
};

const formatTime = computed(() => {
  return (time: number) => {
    const flooredTime = Math.round(time);
    const minute = Math.floor(flooredTime / 60);
    const second = flooredTime % 60;
    return `${minute < 10 ? "0" : ""}${minute}:${
      second < 10 ? "0" : ""
    }${second}`;
  };
});

watch(volume, () => {
  sound.value?.volume(realVolume.value);
});

watch(loop, (val) => {
  sound.value?.loop(val === 2);
});

watch(track, () => {
  sound.value?.unload();
  sound.value = null;
  playing.value = false;
  window.clearInterval(timer.value);
  timer.value = -1;
  time.value = 0;
  duration.value = 0;
  handlePlay();
});

onUnmounted(() => {
  sound.value?.stop();
});
</script>
