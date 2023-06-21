<template>
  <button class="btn btn-square" @click="handleOpen">
    <Icon class="text-2xl" icon="material-symbols:search-rounded" />
  </button>
  <Modal :open="open" @handleClose="handleClose">
    <template v-slot:modal>
      <div class="card bg-base-100">
        <div class="card-body flex-row">
          <dropdown-menu
            with-dropdown-closer
            direction="right"
            :overlay="false"
          >
            <template #trigger>
              <label tabindex="0" class="btn"> {{ platform }} </label>
            </template>
            <template #body>
              <div tabindex="0" class="p-2 bg-base-100">
                <div class="card-body flex flex-col gap-2">
                  <button
                    class="btn"
                    dropdown-closer
                    @click.prevent="platform = 'youtube'"
                  >
                    youtube
                  </button>
                  <button
                    class="btn"
                    dropdown-closer
                    @click.prevent="platform = 'spotify'"
                  >
                    spotify
                  </button>
                </div>
              </div>
            </template>
          </dropdown-menu>
          <form @submit.prevent="handleSearch">
            <input
              type="text"
              placeholder="Search"
              class="input input-bordered w-full"
              v-model="keyword"
            />
          </form>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Modal from "./Modal.vue";
import { Icon } from "@iconify/vue";
import { onKeyStroke } from "@vueuse/core";
import DropdownMenu from "v-dropdown-menu";

const router = useRouter();
const routes = useRoute();
const keyword = ref(routes.query.keyword || "");
const open = ref(false);
const platform = ref("youtube");

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
      platform: platform.value,
    },
  });
};

onKeyStroke("/", (e) => {
  e.preventDefault();
  handleOpen();
});

onKeyStroke("Escape", (e) => {
  e.preventDefault();
  handleClose();
});
</script>
