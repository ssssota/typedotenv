import * as fs from "node:fs/promises";
import { createTransform, generate } from "@typedotenv/core";
import type {
	TransformResult,
	UnpluginBuildContext,
	UnpluginOptions,
} from "unplugin";
import { createUnplugin } from "unplugin";
import { type Options, resolveDotenv, resolveOutput } from "./options";

const name = "unplugin-typedotenv";
export default createUnplugin((options: Options) => {
	const envfile = resolveDotenv(options);
	const output = resolveOutput(options);
	const transform = createTransform(options);
	const generateCode = async () => {
		try {
			const [dotenv, previous] = await Promise.all([
				fs.readFile(envfile, "utf8"),
				fs.readFile(output, "utf8").catch(() => {}),
			]);
			const { code } = generate(dotenv, options);
			if (
				previous?.replace(/[ \n\r\t]+/g, " ") !==
				code.replace(/[ \n\r\t]+/g, " ")
			) {
				await fs.writeFile(output, code);
			}
			return { code };
		} catch (e) {
			console.error(`[${name}]`, e);
			return null;
		}
	};
	return [
		{
			name,
			async buildStart(this: UnpluginBuildContext) {
				this.addWatchFile(envfile);
				await generateCode();
			},
			async watchChange(id) {
				if (id !== envfile) return;
				await generateCode();
			},
		} satisfies UnpluginOptions,
		options.mode === "declaration"
			? ({
					name: `${name}:transform`,
					enforce: "pre",
					transformInclude(id) {
						return /\.[mc]?(js|ts)x?$/.test(id);
					},
					transform(code, _id) {
						return transform(code);
					},
				} satisfies UnpluginOptions)
			: null,
	].filter((p) => p !== null);
});

export type { Options };
