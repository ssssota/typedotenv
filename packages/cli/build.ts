import { buildSync } from "esbuild";

const npmPackageDefineMap = Object.fromEntries(
	Object.keys(process.env)
		.filter((k) => k.startsWith("npm_package_"))
		.map((k) => [`process.env.${k}`, JSON.stringify(process.env[k])] as const),
);

buildSync({
	entryPoints: ["src/index.ts"],
	platform: "node",
	bundle: true,
	outfile: "dist/index.cjs",
	define: { ...npmPackageDefineMap },
	banner: { js: "#!/usr/bin/env node" },
});
