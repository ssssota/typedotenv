import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts"],
	format: ["cjs", "esm"],
	target: "node14",
	splitting: true,
	clean: true,
	dts: true,
	external: ["dotenv"],
});
