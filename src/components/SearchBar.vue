<template>
  <button class="btn btn-square" @click="handleOpen">
    <Icon class="text-2xl" icon="material-symbols:search-rounded" />
  </button>
  <Modal :open="open" @handleClose="handleClose">
    <template v-slot:modal>
      <div class="h-[80vh]">
        <div class="card bg-base-100">
          <div class="card-body flex-col">
            <div class="flex flex-row gap-2">
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
              <form
                @submit.prevent="
                  () => handleSearch(keyword as string, platform)
                "
              >
                <input
                  type="text"
                  placeholder="Search"
                  class="input input-bordered w-full"
                  v-model="keyword"
                  @input="(e) => handleAutoComplete((e.target as HTMLInputElement).value)"
                />
              </form>
            </div>
            <div class="flex flex-col gap-1">
              <div
                class="cursor-pointer"
                @click="handleSearch(item, 'youtube')"
                v-for="item in suggestions"
              >
                {{ item }}
              </div>
            </div>
          </div>
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
import { fetchApi } from "../utils/api";

const router = useRouter();
const routes = useRoute();
const keyword = ref(routes.query.keyword || "");
const open = ref(false);
const platform = ref("youtube");
const suggestions = ref<string[]>([]);

const handleOpen = () => {
  open.value = true;
  handleAutoComplete(keyword.value.toString());
};

const handleClose = () => {
  open.value = false;
};

const handleSearch = (_keyword: string, _platform: string) => {
  open.value = false;
  keyword.value = _keyword;
  router.push({
    name: "Search",
    query: {
      keyword: _keyword,
      platform: _platform,
    },
  });
};

const handleAutoComplete = async (_keyword: string) => {
  const response = await fetchApi("/autocomplete", "get", {
    params: {
      q: _keyword,
    },
  });
  if (response.data.data.keyword === keyword.value) {
    suggestions.value = response.data.data.list;
  }
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
