import { parse } from "dotenv";
import type { GenerateOptions } from "./options";
import { validation } from "./validation";

const defaultPrefix = "/* Auto generated by typedotenv */";

export type Result = {
	/** Generated typescript code */
	readonly code: string;
	/** List of environment variables */
	readonly variables: readonly string[];
};

/**
 * Generate TypeScript from dotenv contents
 * @param dotenv dotenv contents
 * @param options generate options include validation options
 * @returns generated TypeScript code
 */
export const generate = (
	dotenv: string,
	options: GenerateOptions = {},
): Result => {
	const parsed = parse(dotenv);
	validation(parsed, options);
	const eol = options.eol ?? "\n";
	const typeAssertion = options.enableTypeAssertion ? " as string" : "";
	const variables = Object.keys(parsed);
	const definitions = variables.map((key) => {
		const envVar = buildEnvReference(options, key);
		return [
			!options.disableRuntimeTypeCheck &&
				`if (typeof ${envVar} !== 'string') throw new Error('${key} is not defined in .env');`,
			`export const ${key} = ${envVar}${typeAssertion};`,
		]
			.filter(Boolean)
			.join(eol);
	});
	const code = [options.prefix ?? defaultPrefix, ...definitions].join(eol);
	return {
		code: code + eol,
		variables,
	};
};

export const buildEnvReference = (options: GenerateOptions, env: string) => {
	const envObject = options.envObject ?? "process.env";
	return options.accessFromIndexSignature
		? `${envObject}["${env}"]`
		: `${envObject}.${env}`;
};