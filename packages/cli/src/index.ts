import { createCommand } from "@commander-js/extra-typings";
import { generate } from "@typedotenv/core";
import * as fs from "fs/promises";
import * as path from "path";

const generateCommand = createCommand("generate")
	.argument("[output-file]", "Destination of TypeScript file", "env.ts")
	.option(
		"-e --env <environment>",
		".env file suffix (e.g. production -> .env.production)",
	)
	.option(
		"-d --dir <envfile_directory>",
		".env file directory path [default:CWD]",
	)
	.action(async (out, { env, dir }) => {
		const envDir = dir ?? process.cwd();
		const envFile = env ? `.env.${env}` : ".env";
		const envPath = path.join(envDir, envFile);
		const dotenv = await fs.readFile(envPath, "utf8");
		const code = generate(dotenv);
		await fs.writeFile(out, code);
	});

const command = createCommand("typedotenv")
	.version(process.env.npm_package_version!)
	.description(process.env.npm_package_description!)
	.addCommand(generateCommand)
	.action((_, cmd) => {
		cmd.help();
	});
command.parseAsync(process.argv).catch(console.error);
