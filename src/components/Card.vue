<template>
  <div class="card card-compact bg-base-100 shadow-lg m-2" ref="cardRef">
    <div
      class="card-body grow flex-row items-center"
      :class="queue ? 'gap-3' : 'gap-5'"
      v-if="track"
    >
      <LazyImg
        :src="`/public/${track?.thumbnail}`"
        class="aspect-auto rounded-md shrink-0"
        :class="mobile || queue ? 'w-[5rem]' : 'w-[6rem]'"
      />
      <div class="flex flex-col overflow-hidden grow shrink-1 w-0">
        <Marquee :text="track.title" class="card-title" />
        <p class="inline-block min-w-0">
          <span className="font-semibold truncate block">
            {{ track.uploader }}
          </span>
        </p>
        <p class="inline-block min-w-0">
          <span className="text-xs truncate block">
            Play Count: {{track.playCount}}
          </span>
        </p>
      </div>
      <div class="shrink-0 flex gap-2">
        <div class="tooltip" data-tip="Add to queue" v-if="enqueue">
          <button
            class="btn btn-square"
            :class="{ 'btn-sm': queue || mobile }"
            @click="handleEnqueue"
            :disabled="enqueueLoading"
          >
            <span class="loading loading-spinner" v-if="enqueueLoading"></span>
            <Icon
              v-else
              icon="material-symbols:add-to-queue-outline-rounded"
              :class="queue || mobile ? 'text-lg' : 'text-2xl'"
            />
          </button>
        </div>
        <div
          class="tooltip"
          data-tip="like"
          v-if="like && (isHovered || loading || !queue) && user.isLoggedin"
        >
          <button class="btn btn-square" :class="{ 'btn-sm': queue || mobile }">
            <Icon
              icon="material-symbols:heart-plus"
              :class="queue || mobile ? 'text-lg' : 'text-2xl'"
            />
          </button>
        </div>
        <div
          class="tooltip"
          data-tip="delete"
          v-if="remove && (isHovered || loading || !queue)"
        >
          <button
            class="btn btn-square btn-outline btn-error"
            :class="{ 'btn-sm': queue || mobile }"
            @click="handleDelete"
            :disabled="deleteLoading"
          >
            <span class="loading loading-spinner" v-if="deleteLoading"></span>
            <Icon
              v-else
              icon="material-symbols:delete-forever-rounded"
              :class="queue || mobile ? 'text-lg' : 'text-2xl'"
            />
          </button>
        </div>
      </div>
    </div>
    <div class="card-body" v-else>
      <div class="card-title">
        <slot name="fallback">Nothing is playing</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  breakpointsTailwind,
  useBreakpoints,
  useElementHover,
} from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { useUserStore } from "../store/user";
import { usePlayer } from "../store/player";
import { fetchApi } from "../utils/api";
import LazyImg from "./LazyImg.vue";
import Marquee from "./Marquee.vue";

const cardRef = ref();
const isHovered = useElementHover(cardRef);

const props = withDefaults(
  defineProps<{
    track?: Track;
    enqueue?: boolean;
    like?: boolean;
    remove?: boolean;
    queue?: boolean;
    index?: number;
  }>(),
  {
    enqueue: true,
    like: true,
    remove: false,
    queue: false,
    index: 0,
  }
);

const emits = defineEmits(["handleEnqueue"]);

const player = usePlayer();
const user = useUserStore();

const breakpoints = useBreakpoints(breakpointsTailwind);
const mobile = breakpoints.smaller("lg");

const enqueueLoading = ref(false);
const deleteLoading = ref(false);
const likeLoading = ref(false);

const loading = computed(() => {
  return deleteLoading.value || likeLoading.value;
});

const handleEnqueue = async () => {
  if (!props.track) return;
  enqueueLoading.value = true;
  const _track = user.isLoggedin
    ? await player.enqueue(props.track)
    : await player.playOne(props.track);
  enqueueLoading.value = false;
  emits("handleEnqueue", props.track);
};

const handleDelete = async () => {
  if (!props.track) return;
  if (!user.isLoggedin && props.index === 0) {
    player.track = undefined;
    return;
  }
  deleteLoading.value = true;
  const response = await fetchApi("/queue", "DELETE", {
    data: {
      id: props.track?.id,
      idx: props.index,
    },
  });
  await player.getQueue();
  deleteLoading.value = false;
};
</script>
