import { promises as fs } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import fg from "fast-glob";
import { basename } from "path/posix";

async function run() {
	// fix cjs exports
	const files = await fg("*.cjs", {
		ignore: ["chunk-*"],
		absolute: true,
		cwd: resolve(fileURLToPath(import.meta.url), "../dist"),
	});
	for (const file of files) {
		console.log("[postbuild]", basename(file));
		let code = await fs.readFile(file, "utf8");
		code = code.replace(
			/exports\.default\s*=\s*(.+);/,
			"$1.default = $1;\nmodule.exports = $1;",
		);
		await fs.writeFile(file, code);
	}
}

run();
