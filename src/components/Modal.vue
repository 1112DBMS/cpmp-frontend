<template>
  <slot name="button" :handleOpen="handleOpen"></slot>
  <Teleport to="body">
    <Transition :duration="transitionDuration as any" :name="transitionName">
      <div
        v-if="open"
        class="modalBackdrop"
        :class="backdropClass"
        @click="handleBackdropClose"
      >
        <div @click="(e) => e.stopPropagation()" class="modalWrapper">
          <slot name="modal" :handleClose="handleClose">
            <div
              class="h-[50vh] w-[100vw] max-w-lg rounded-2xl bg-base-100 p-2 shadow"
            ></div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
  },
  backdropClose: {
    type: Boolean,
    default: true,
  },
  backdropClass: {
    type: String,
    default: "flex items-center justify-center",
  },
  transitionName: {
    type: String,
    default: "modalWrapper",
  },
  transitionDuration: {
    type: Object,
    default: {
      enter: 300,
      leave: 300,
    },
  },
});
const emit = defineEmits(["handleClose"]);

const open = ref(false);

const handleOpen = () => {
  open.value = true;
};

const handleBackdropClose = () => {
  if (props.backdropClose === true) handleClose();
};

const handleClose = () => {
  open.value = false;
  emit("handleClose");
};

onMounted(() => {
  if (props.open) open.value = true;
});

watch(
  () => props.open,
  (val) => {
    open.value = val;
  }
);
</script>

<style scoped>
.modalWrapper-enter-active,
.modalWrapper-leave-active {
  transition: all 0.3s ease;
}

.modalWrapper-enter-from,
.modalWrapper-leave-to {
  opacity: 0;
}

.modalBackdrop {
  @apply absolute top-0 left-0 z-30 h-full w-full overflow-hidden bg-[#000000aa];
}
</style>
