import type { GenerateOptions } from "@typedotenv/core";
import { generate } from "@typedotenv/core";
import * as fs from "fs/promises";
import * as path from "path";
import { createUnplugin, UnpluginBuildContext } from "unplugin";

type EnvOptions =
	| {
			/**
			 * .env file suffix (e.g. production -> .env.production)
			 */
			env?: string | undefined;
			/**
			 * .env file directory
			 */
			envDir?: string | undefined;
			envFile?: undefined;
	  }
	| {
			env?: undefined;
			envDir?: undefined;
			/**
			 * .env filepath
			 */
			envFile?: string | undefined;
	  };
export type Options = (GenerateOptions & EnvOptions) & {
	/**
	 * Destination for generated TypeScript file path
	 */
	output?: string;
};

const resolveDotenv = ({ env, envDir, envFile }: EnvOptions): string => {
	if (envFile) return envFile;
	const dir = envDir ?? process.cwd();
	const file = env ? `.env.${env}` : ".env";
	return path.join(dir, file);
};

const name = "unplugin-typedotenv";
export default createUnplugin((options: Options) => {
	const envfile = resolveDotenv(options);
	const { output = "env.ts" } = options;
	const generateCode = async () => {
		try {
			const [dotenv, previous] = await Promise.all([
				fs.readFile(envfile, "utf8"),
				fs.readFile(output, "utf8").catch(() => {}),
			]);
			const code = generate(dotenv, options);
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
	return {
		name,
		async buildStart(this: UnpluginBuildContext) {
			this.addWatchFile(envfile);
			await generateCode();
		},
		async watchChange(id) {
			if (id !== envfile) return;
			await generateCode();
		},
	};
});
