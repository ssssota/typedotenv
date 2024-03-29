import type { ExecFileOptions } from "node:child_process";
import { execFile } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename, "..");
const outDir = path.join(__dirname, "output");
const run = (
	args: string[] = [],
	opts: ExecFileOptions = {},
): Promise<{ stdout: string; stderr: string }> => {
	return new Promise((resolve, reject) => {
		execFile(
			"node",
			["../dist/index.cjs", ...args],
			{ ...opts, cwd: __dirname },
			(error, o, e) => {
				if (error) return reject({ error, stdout: o, stderr: e });
				return resolve({ stdout: o, stderr: e });
			},
		);
	});
};

beforeAll(async () => {
	if (await fs.readdir(outDir).catch(() => false)) return;
	await fs.mkdir(outDir);
});
afterAll(async () => {
	if (await fs.readdir(outDir).catch(() => false))
		await fs.rm(outDir, { recursive: true, force: true });
});

it("should output help message", async () => {
	const result = await run();
	expect(result.stderr).toBe("");
	expect(result.stdout).toMatchInlineSnapshot(`
		"Usage: typedotenv [options] [command]

		CLI tool for typedotenv (dotenv utility for TypeScript)

		Options:
		  -V, --version                     output the version number
		  -h, --help                        display help for command

		Commands:
		  generate [options] [output-file]
		  check [options] [output-file]
		"
	`);
});

it("should output help message for generate", async () => {
	const result = await run(["generate", "--help"]);
	expect(result.stderr).toBe("");
	expect(result.stdout).toMatchInlineSnapshot(`
		"Usage: typedotenv generate [options] [output-file]

		Arguments:
		  output-file                    Destination of TypeScript file (default:
		                                 \\"env.ts\\")

		Options:
		  -i --input <env_filepath>      .env file (e.g. .env.development)
		  -e --env <environment>         .env file suffix (e.g. production ->
		                                 .env.production)
		  -d --dir <envfile_directory>   .env file directory path [default:CWD]
		  --env-object <object>          Object provide env variable
		                                 [default:process.env]
		  --enable-type-assertion        Disable type assertion (\`as string\`)
		  --disable-type-check           Disable runtime type-check
		  --access-from-index-signature  Access from index signature
		  --allow <allow_key>            Allow keys (If you specify this, you won't be
		                                 able to use other keys) (default: [])
		  --deny <deny_key>              Deny keys (default: [])
		  --required <required_key>      Required keys (default: [])
		  -h, --help                     display help for command
		"
	`);
});

it("should output help message for check", async () => {
	const result = await run(["check", "--help"]);
	expect(result.stderr).toBe("");
	expect(result.stdout).toMatchInlineSnapshot(`
		"Usage: typedotenv check [options] [output-file]

		Arguments:
		  output-file                    Destination of TypeScript file (default:
		                                 \\"env.ts\\")

		Options:
		  -i --input <env_filepath>      .env file (e.g. .env.development)
		  -e --env <environment>         .env file suffix (e.g. production ->
		                                 .env.production)
		  -d --dir <envfile_directory>   .env file directory path [default:CWD]
		  --env-object <object>          Object provide env variable
		                                 [default:process.env]
		  --enable-type-assertion        Disable type assertion (\`as string\`)
		  --disable-type-check           Disable runtime type-check
		  --access-from-index-signature  Access from index signature
		  --allow <allow_key>            Allow keys (If you specify this, you won't be
		                                 able to use other keys) (default: [])
		  --deny <deny_key>              Deny keys (default: [])
		  --required <required_key>      Required keys (default: [])
		  -h, --help                     display help for command
		"
	`);
});

it("should generate from default envfile .env", async () => {
	const outPath = path.join(outDir, "default.ts");
	await run(["generate", outPath]);
	expect(await fs.readFile(outPath, "utf8")).toMatchInlineSnapshot(`
		"/* Auto generated by typedotenv */
		if (typeof process.env.TEST !== 'string') throw new Error('TEST is not defined in .env');
		export const TEST = process.env.TEST;
		"
	`);
});

it("should generate from .env.test", async () => {
	const outPath = path.join(outDir, "test.ts");
	await run(["generate", "-e", "test", outPath]);
	expect(await fs.readFile(outPath, "utf8")).toMatchInlineSnapshot(`
		"/* Auto generated by typedotenv */
		if (typeof process.env.KEY !== 'string') throw new Error('KEY is not defined in .env');
		export const KEY = process.env.KEY;
		"
	`);
});

it("should generate from .env.test", async () => {
	const outPath = path.join(outDir, "dir.ts");
	await run(["generate", "-d", "envfiles", outPath]);
	expect(await fs.readFile(outPath, "utf8")).toMatchInlineSnapshot(`
		"/* Auto generated by typedotenv */
		if (typeof process.env.HELLO !== 'string') throw new Error('HELLO is not defined in .env');
		export const HELLO = process.env.HELLO;
		"
	`);
});

it("should generate from .env.test", async () => {
	const outPath = path.join(outDir, "dir.ts");
	await run(["generate", "-i", "envfiles/.env.production", outPath]);
	expect(await fs.readFile(outPath, "utf8")).toMatchInlineSnapshot(`
		"/* Auto generated by typedotenv */
		if (typeof process.env.API_KEY !== 'string') throw new Error('API_KEY is not defined in .env');
		export const API_KEY = process.env.API_KEY;
		"
	`);
});

it("should generate without type check", async () => {
	const outPath = path.join(outDir, "disableTypeCheck.ts");
	await run(["generate", "--disable-type-check", outPath]);
	expect(await fs.readFile(outPath, "utf8")).toMatchInlineSnapshot(`
		"/* Auto generated by typedotenv */
		export const TEST = process.env.TEST;
		"
	`);
});

it("should generate with type assertion", async () => {
	const outPath = path.join(outDir, "enableTypeAssertion.ts");
	await run(["generate", "--enable-type-assertion", outPath]);
	expect(await fs.readFile(outPath, "utf8")).toMatchInlineSnapshot(`
		"/* Auto generated by typedotenv */
		if (typeof process.env.TEST !== 'string') throw new Error('TEST is not defined in .env');
		export const TEST = process.env.TEST as string;
		"
	`);
});

it("should generate code using import.meta.env", async () => {
	const outPath = path.join(outDir, "envObject.ts");
	await run(["generate", "--env-object=import.meta.env", outPath]);
	expect(await fs.readFile(outPath, "utf8")).toMatchInlineSnapshot(`
		"/* Auto generated by typedotenv */
		if (typeof import.meta.env.TEST !== 'string') throw new Error('TEST is not defined in .env');
		export const TEST = import.meta.env.TEST;
		"
	`);
});

it("should pass check", async () => {
	const outPath = path.join(outDir, "passCheck.ts");
	await run(["generate", outPath]);
	await run(["check", outPath]);
});

it("should fail check", async () => {
	const outPath = path.join(outDir, "failCheck.ts");
	await run(["generate", outPath]);
	const res = await run(["check", "-etest", outPath]).catch((e) => e);
	expect(res.error.code).toBe(1);
	expect(res.stderr).toBe(`${outPath} does not have variables: KEY\n`);
});
