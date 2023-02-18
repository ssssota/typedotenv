import preact from "@preact/preset-vite";
import typedotenv from "unplugin-typedotenv/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		typedotenv({
			output: "src/env.ts",
			env: mode,
			envObject: "import.meta.env",
		}),
		preact(),
	],
	base: "/typedotenv/",
}));
