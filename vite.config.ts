import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import nodePolyfills from "vite-plugin-node-stdlib-browser";

const config: UserConfig = {
  plugins: [sveltekit(), nodePolyfills()],
};

export default config;
