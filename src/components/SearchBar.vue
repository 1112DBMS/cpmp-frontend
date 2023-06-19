<template>
  <button class="btn btn-square" @click="handleOpen">
    <Icon class="text-2xl" icon="material-symbols:search-rounded" />
  </button>
  <Modal :open="open" @handleClose="handleClose">
    <template v-slot:modal>
      <div class="card bg-base-100">
        <form @submit.prevent="handleSearch" class="card-body flex-row">
          <button type="button" class="btn">Youtube</button>
          <input
            type="text"
            placeholder="Search"
            class="input input-bordered w-full"
            v-model="keyword"
          />
        </form>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Modal from "./Modal.vue";
import { Icon } from "@iconify/vue";
import { onKeyStroke } from '@vueuse/core'

const router = useRouter();
const routes = useRoute();
const keyword = ref(routes.query.keyword || "");
const open = ref(false);

const handleOpen = () => {
  open.value = true;
};

const handleClose = () => {
  open.value = false;
};

const handleSearch = () => {
  open.value = false;
  router.push({
    name: "Search",
    query: {
      keyword: keyword.value,
    },
  });
};

onKeyStroke("/", (e) => {
  e.preventDefault()
  handleOpen()
})

onKeyStroke("Escape", (e) => {
  e.preventDefault()
  handleClose()
})
</script>
