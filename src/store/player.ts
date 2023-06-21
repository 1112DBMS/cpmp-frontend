import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { fetchApi } from "../utils/api";
import { useUserStore } from "./user";

export const usePlayer = defineStore("player", () => {
  const queueId = ref<string | undefined>(undefined);
  const loading = ref(false);
  const queue = ref<QueueTrack[]>([]);
  // 0: no loop, 1: queue, 2: one song
  const loop = ref<0 | 1 | 2>(0);
  const loopLoading = ref(false);
  const shuffleLoading = ref(false);

  const user = useUserStore();

  const track = ref<QueueTrack | undefined>(undefined);

  const getQueue = async () => {
    loading.value = true;
    try {
      const response = await fetchApi("/queue", "GET", {
        params: {
          id: queueId.value,
        },
      });
      loading.value = false;
      loop.value = response.data.data.loop;
      let tmpQueue: QueueTrack[] = response.data.data.list;
      if (tmpQueue.length > 0) {
        const tmpTrack = tmpQueue.shift();
        if (
          (track.value && tmpTrack && tmpTrack.time !== track.value.time) ||
          !track.value
        ) {
          track.value = tmpTrack;
        }
        queue.value = tmpQueue;
      } else {
        track.value = undefined;
        queue.value = [];
      }
    } catch (e) {
      track.value = undefined;
      queue.value = [];
    }
  };

  const enqueue = async (_track: Track) => {
    loading.value = true;
    const response = await fetchApi("/queue", "POST", {
      data: {
        id: _track.id,
      },
    });
    loading.value = false;

    // download if not downloaded
    if (!_track.download) {
      loading.value = true;
      const response = await fetchApi("/download", "post", {
        data: {
          id: _track.id,
        },
      });
      loading.value = false;
      const { data, error } = response.data;
      if (error) throw new Error(data);
      _track.download = true;
    }
    await getQueue();
    return _track;
  };

  const playOne = async (_track: Track) => {
    if (!_track.download) {
      loading.value = true;
      const response = await fetchApi("/download", "post", {
        data: {
          id: _track.id,
        },
      });
      loading.value = false;
      const { data, error } = response.data;
      if (error) throw new Error(data);
      _track.download = true;
    }
    track.value = {
      ..._track,
      time: "no-time",
    };
    return _track;
  };

  const next = async () => {
    loading.value = true;
    try {
      const response = await fetchApi("/queue/next", "POST", {
        data: {
          queue: queueId.value,
        },
      });
    } catch (e) {
      console.error(e);
    }
    loading.value = false;
    await getQueue();
  };

  const toggleLoop = async () => {
    const value = ((loop.value + 1) % 3) as 0 | 1 | 2;
    if (!user.isLoggedin) {
      if (value === 1) {
        loop.value = 2;
      } else {
        loop.value = value;
      }
      return;
    }
    loopLoading.value = true;
    try {
      const response = await fetchApi("/queue/loop", "POST", {
        data: {
          loop: value,
        },
      });
      loop.value = value;
    } catch (e) {
      console.error(e);
    }
    loopLoading.value = false;
  };

  const toggleShuffle = async () => {
    shuffleLoading.value = true;
    try {
      const response = await fetchApi("/queue/shuffle", "POST", {
        data: {
          queue: queueId.value,
        },
      });
    } catch (e) {
      console.error(e);
    }
    await getQueue();
    shuffleLoading.value = false;
  };

  return {
    track,
    loop,
    loading,
    loopLoading,
    shuffleLoading,
    queue,
    enqueue,
    next,
    toggleLoop,
    toggleShuffle,
    getQueue,
    playOne,
  };
});
