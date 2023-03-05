import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import nodePolyfills from "vite-plugin-node-stdlib-browser";

const config = defineConfig({
  plugins: [sveltekit(), nodePolyfills()],
  build: {
    target: "es2020",
  },
  optimizeDeps: {
    esbuildOptions: { target: "es2020" },
  },
});

export default config;
