import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const config: UserConfig = {
  plugins: [sveltekit(), nodePolyfills()],
  resolve: {
    alias: { "near-api-js": "near-api-js/dist/near-api-js.js" },
  },
};

export default config;
