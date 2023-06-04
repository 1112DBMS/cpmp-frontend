import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const API_BACKEND = process.env.VITE_API_BACKEND;
  return defineConfig({
    plugins: [vue()],
    server: {
      proxy: {
        "/api": {
          target: API_BACKEND,
          changeOrigin: true,
        },
        "/public": {
          target: API_BACKEND,
          changeOrigin: true,
        },
        "/songs": {
          target: API_BACKEND,
          changeOrigin: true,
        },
      },
      port: 3000,
    },
  });
};
