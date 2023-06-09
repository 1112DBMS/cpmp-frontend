<template>
  <div
    class="bg-base-100"
    :disabled="realLoading"
    :loading="realLoading"
    v-if="track"
    @click="handleOpen"
  >
    <div class="flex gap-6 items-center p-4">
      <LazyImg
        :src="`/public/${track?.thumbnail}`"
        class="aspect-auto rounded-md"
        :class="mobile ? 'h-[3.75rem]' : 'h-[4.5rem]'"
      />
      <div class="flex flex-col gap-2 grow overflow-hidden justify-center">
        <div class="flex gap-2">
          <Marquee :text="track.title" class="grow self-center font-semibold" />
          <div class="flex gap-2">
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
              @click.stop="handlePlay"
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
              @click.stop="handleNext"
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
              :disabled="!user.isLoggedin || shuffleLoading"
              @click="handleToggleShuffle"
            >
              <span
                class="loading loading-spinner"
                v-if="shuffleLoading"
              ></span>
              <Icon
                icon="material-symbols:shuffle-outline-rounded"
                class="text-2xl"
                v-else
              />
            </button>
          </div>
        </div>

        <div class="flex gap-2 items-center" v-if="!mobile">
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
  <MobilePlayer :open="open" @handleClose="open = false">
    <template v-slot:default>
      <ScrollFrame>
        <div class="flex flex-col gap-4 min-h-full">
          <div class="flex justify-center items-center grow h-1/2">
            <LazyImg
              :src="`/public/${track?.thumbnail}`"
              class="aspect-auto rounded-lg"
            />
          </div>
          <Marquee
            :text="track?.title"
            class="font-bold text-2xl text-center"
          />
          <p class="inline-block min-w-0">
            <span className="font-semibold truncate block">
              {{ track?.uploader }}
            </span>
          </p>
          <div class="flex gap-2 items-center">
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
          <div class="flex gap-2 justify-center">
            <button
              class="btn btn-circle"
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
              @click="handleToggleShuffle"
              :disabled="!user.isLoggedin || shuffleLoading"
            >
              <span
                class="loading loading-spinner"
                v-if="shuffleLoading"
              ></span>
              <Icon
                icon="material-symbols:shuffle-outline-rounded"
                class="text-2xl"
                v-else
              />
            </button>
          </div>
          <Queue :nowPlaying="false" />
        </div>
      </ScrollFrame>
    </template>
  </MobilePlayer>
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
import MobilePlayer from "./MobilePlayer.vue";
import Queue from "./Queue.vue";
import LazyImg from "./LazyImg.vue";
import ScrollFrame from "./ScrollFrame.vue";
import Marquee from "./Marquee.vue";
import { createSession, updateSession } from "../utils/mediaSessoion";

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
const {
  track,
  loop,
  loading: downloadLoading,
  shuffleLoading,
} = storeToRefs(player);

const realLoading = computed(() => loading.value || downloadLoading.value);

const realVolume = computed(() => Math.pow(volume.value, 2.3) * 0.7);

const handlePlay = () => {
  if (!sound.value) {
    loading.value = true;
    sound.value = new Howl({
      src: [`/api/play?id=${track.value?.id}`],
      // src: [`/songs/${track.value?.id}`],
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
        if (track.value) createSession(track.value, handlePlay, handleNext);
        timer.value = window.setInterval(() => {
          time.value = sound.value?.seek() || 0;
          updateSession(duration.value, time.value);
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

const handleOpen = () => {
  if (mobile.value) {
    open.value = true;
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

watch(track, (val) => {
  sound.value?.unload();
  sound.value = null;
  playing.value = false;
  window.clearInterval(timer.value);
  timer.value = -1;
  time.value = 0;
  duration.value = 0;
  if (!val) {
    open.value = false;
    return;
  }
  handlePlay();
});

onUnmounted(() => {
  sound.value?.stop();
});
</script>
