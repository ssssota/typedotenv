import * as fs from "node:fs/promises";
import { generate } from "@typedotenv/core";
import type {
	TransformResult,
	UnpluginBuildContext,
	UnpluginOptions,
} from "unplugin";
import { createUnplugin } from "unplugin";
import { type Options, resolveDotenv, resolveOutput } from "./options";
import { createTransform } from "./transform";

const name = "unplugin-typedotenv";
export default createUnplugin((options: Options) => {
	const envfile = resolveDotenv(options);
	const output = resolveOutput(options);
	let transform: (code: string) => TransformResult = () => null;
	const generateCode = async () => {
		try {
			const [dotenv, previous] = await Promise.all([
				fs.readFile(envfile, "utf8"),
				fs.readFile(output, "utf8").catch(() => {}),
			]);
			const { code, variables } = generate(dotenv, options);
			transform = createTransform(options, variables);
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
