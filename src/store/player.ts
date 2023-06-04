import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { fetchApi } from "../utils/api";

export const usePlayer = defineStore("player", () => {
  const queueId = ref<string | undefined>(undefined);
  const loading = ref(false);
  const queue = ref<QueueTrack[]>([]);
  // 0: no loop, 1: queue, 2: one song
  const loop = ref<0 | 1 | 2>(0);
  const loopLoading = ref(false);

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
    if (loop.value === 2) return;
    loading.value = true;
    try {
      const response = await fetchApi("/queue", "DELETE", {
        data: {
          id: track.value?.id,
          idx: 0,
        },
      });
    } catch (e) {
      console.error(e);
    }
    loading.value = false;
    await getQueue();
  };

  const toggleLoop = async () => {
    loopLoading.value = true;
    const value = ((loop.value + 1) % 3) as 0 | 1 | 2;
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

  const toggleShuffle = () => {
    
  };

  return {
    track,
    loop,
    loading,
    loopLoading,
    queue,
    enqueue,
    next,
    toggleLoop,
    toggleShuffle,
    getQueue,
    playOne,
  };
});
