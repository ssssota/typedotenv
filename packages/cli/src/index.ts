import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
	type Command,
	type OptionValues,
	createCommand,
} from "@commander-js/extra-typings";
import { generate } from "@typedotenv/core";

type Options = {
	input?: string | undefined;
	env?: string | undefined;
	dir?: string | undefined;
	envObject?: string | undefined;
	enableTypeAssertion?: true | undefined;
	disableTypeCheck?: true | undefined;
	accessFromIndexSignature?: true | undefined;
	allow: string[];
	deny: string[];
	required: string[];
};

const applyGenerateOptions = <
	Args extends unknown[],
	Opts extends OptionValues,
>(
	cmd: Command<Args, Opts>,
) => {
	return cmd
		.option("-i --input <env_filepath>", ".env file (e.g. .env.development)")
		.option(
			"-e --env <environment>",
			".env file suffix (e.g. production -> .env.production)",
		)
		.option(
			"-d --dir <envfile_directory>",
			".env file directory path [default:CWD]",
		)
		.option(
			"--env-object <object>",
			"Object provide env variable [default:process.env]",
		)
		.option("--enable-type-assertion", "Disable type assertion (`as string`)")
		.option("--disable-type-check", "Disable runtime type-check")
		.option("--access-from-index-signature", "Access from index signature")
		.option(
			"--allow <allow_key>",
			"Allow keys (If you specify this, you won't be able to use other keys)",
			(v, p: string[]) => [...p, v],
			[],
		)
		.option("--deny <deny_key>", "Deny keys", (v, p: string[]) => [...p, v], [])
		.option(
			"--required <required_key>",
			"Required keys",
			(v, p: string[]) => [...p, v],
			[],
		);
};

const generateCodeFromOptions = async ({
	input,
	env,
	dir,
	enableTypeAssertion,
	disableTypeCheck,
	accessFromIndexSignature,
	envObject,
	allow,
	deny,
	required,
}: Options) => {
	const envDir = dir ?? process.cwd();
	const envFile = env ? `.env.${env}` : ".env";
	const envPath = input ?? path.join(envDir, envFile);
	const dotenv = await fs.readFile(envPath, "utf8");
	const propOptions =
		allow.length > 0
			? ({ allowList: allow } as const)
			: ({
					denyList: deny.length > 0 ? deny : undefined,
					required: required.length > 0 ? required : undefined,
				} as const);
	return generate(dotenv, {
		...propOptions,
		envObject,
		enableTypeAssertion,
		disableRuntimeTypeCheck: disableTypeCheck,
		accessFromIndexSignature,
	});
};

const listVarsFromCode = (code: string) => {
	const exportList = code.match(/export const .+? =/g) ?? [];
	return exportList.flatMap((ex) => {
		const match = ex.match(/export const (.+?) =/);
		return match ? match[1] : [];
	});
};

const generateCommand = applyGenerateOptions(
	createCommand("generate").argument(
		"[output-file]",
		"Destination of TypeScript file",
		"env.ts",
	),
).action(async (output, options: Options) => {
	const code = await generateCodeFromOptions(options);
	await fs.writeFile(output, code);
});

const checkCommand = applyGenerateOptions(
	createCommand("check").argument(
		"[output-file]",
		"Destination of TypeScript file",
		"env.ts",
	),
).action(async (output, options: Options) => {
	const [target, current] = await Promise.all([
		generateCodeFromOptions(options),
		fs.readFile(output, "utf8"),
	]);
	const targetVars = listVarsFromCode(target);
	const currentVars = listVarsFromCode(current);
	const target$current = targetVars.filter((v) => !currentVars.includes(v));
	if (target$current.length > 0)
		throw new Error(
			`${output} does not have variables: ${target$current.join(",")}`,
		);
	const current$target = currentVars.filter((v) => !targetVars.includes(v));
	if (current$target.length > 0)
		throw new Error(
			`.env does not have variables: ${current$target.join(",")}`,
		);
});

const command = createCommand("typedotenv")
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	.version(process.env.npm_package_version!)
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	.description(process.env.npm_package_description!)
	.addCommand(generateCommand)
	.addCommand(checkCommand)
	.action((_, cmd) => {
		cmd.help();
	});

command
	.parseAsync(process.argv)
	.then(() => {
		process.exit(0);
	})
	.catch((e) => {
		console.error(e instanceof Error ? e.message : e);
		process.exit(1);
	});
