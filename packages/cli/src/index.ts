import { createCommand } from "@commander-js/extra-typings";
import { generate } from "@typedotenv/core";
import * as fs from "fs/promises";
import * as path from "path";

const generateCommand = createCommand("generate")
	.argument("[output-file]", "Destination of TypeScript file", "env.ts")
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
		"Object provide env variables [default:process.env]",
	)
	.option("--enable-type-assertion", "Disable type assertion (`as string`)")
	.option("--disable-type-check", "Disable runtime type-check")
	.action(
		async (
			output,
			{ input, env, dir, enableTypeAssertion, disableTypeCheck, envObject },
		) => {
			const envDir = dir ?? process.cwd();
			const envFile = env ? `.env.${env}` : ".env";
			const envPath = input ?? path.join(envDir, envFile);
			const dotenv = await fs.readFile(envPath, "utf8");
			const code = generate(dotenv, {
				envObject,
				enableTypeAssertion,
				disableRuntimeTypeCheck: disableTypeCheck,
			});
			await fs.writeFile(output, code);
		},
	);

const command = createCommand("typedotenv")
	.version(process.env.npm_package_version!)
	.description(process.env.npm_package_description!)
	.addCommand(generateCommand)
	.action((_, cmd) => {
		cmd.help();
	});
command.parseAsync(process.argv).catch(console.error);
