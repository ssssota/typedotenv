import path from "node:path";
import type { GenerateOptions } from "@typedotenv/core";

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

export const resolveDotenv = ({ env, envDir, envFile }: EnvOptions): string => {
	if (envFile) return envFile;
	const dir = envDir ?? process.cwd();
	const file = env ? `.env.${env}` : ".env";
	return path.join(dir, file);
};
export const resolveOutput = ({
	output,
	mode,
}: Pick<Options, "output" | "mode">): string => {
	if (output) return output;
	if (mode === "declaration") return "env.d.ts";
	return ".env.ts";
};
