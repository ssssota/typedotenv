import { expect, it } from "vitest";
import { createTransform } from "./transform";

it("should return null when imports not found", () => {
	const transform = createTransform({ mode: "declaration" });
	expect(transform("// noop")).toBe(null);
});

it("should transform namespace imports", () => {
	const transform = createTransform({ mode: "declaration" });
	const result = transform(`
import * as env from "virtual:env";
console.log(env.TEST, env . TEST2);
console.log(env[ 'TEST' ], env ["TEST2"]);
`);
	expect(result?.code).toMatchInlineSnapshot(`
		"

		console.log(process.env.TEST, process.env.TEST2);
		console.log(process.env.TEST, process.env.TEST2);
		"
	`);
});

it("should transform named imports", () => {
	const transform = createTransform({ mode: "declaration" });
	const result = transform(`
import { TEST, TEST2 } from "virtual:env";
console.log(TEST, TEST2);
`);
	expect(result?.code).toMatchInlineSnapshot(`
		"

		console.log(process.env.TEST, process.env.TEST2);
		"
	`);
});
