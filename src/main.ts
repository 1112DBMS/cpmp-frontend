import { createApp } from "vue";
import "./style/main.css";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

const pinia = createPinia();

const documentHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", documentHeight);
documentHeight();

createApp(App).use(pinia).use(router).mount("#app");
