<template>
  <Modal
    transitionName="bottom-pannel"
    :transitionDuration="{ enter: 300, leave: 400 }"
    backdropClass="flex items-end justify-center"
    :open="open"
    @handleClose="handleClose"
  >
    <template v-slot:modal="{ handleClose }">
      <div class="modal-content">
        <slot :handleClose="handleClose"></slot>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "./Modal.vue"
const props = defineProps({
  class: {
    type: String,
    default: "modal-content",
  },
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["handleClose"]);

const handleClose = () => emit("handleClose");
</script>

<style>
.bottom-pannel-enter-active,
.bottom-pannel-leave-active {
  transition: all 0.3s ease-in-out;
}

.bottom-pannel-enter-from,
.bottom-pannel-leave-to {
  opacity: 0;
}

.bottom-pannel-enter-active .modalWrapper,
.bottom-pannel-leave-active .modalWrapper {
  transition: all 0.3s ease-in-out;
}

.bottom-pannel-leave-active {
  transition-delay: 0.1s;
}

.bottom-pannel-enter-from .modalWrapper,
.bottom-pannel-leave-to .modalWrapper {
  transform: translateY(100vh);
}
</style>

<style scoped>
.modal-content {
  @apply h-[90vh] w-[100vw] rounded-t-2xl bg-base-100 p-6 shadow;
}
</style>