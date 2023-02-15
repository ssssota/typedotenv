import { buildSync } from "esbuild";

const npmPackageDefineMap = Object.keys(process.env)
	.filter((k) => k.startsWith("npm_package_"))
	.reduce<Record<string, string>>((map, key) => {
		return { ...map, [`process.env.${key}`]: JSON.stringify(process.env[key]) };
	}, {});

buildSync({
	entryPoints: ["src/index.ts"],
	platform: "node",
	bundle: true,
	outfile: "dist/index.cjs",
	define: { ...npmPackageDefineMap },
});
