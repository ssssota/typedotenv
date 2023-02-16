import { expect, it } from "vitest";
import { generate } from "./index";

it("should generate exports", () => {
	expect(generate("A=a\nB=")).toBe(
		[
			"/* Auto generated by typedotenv */",
			"export const A = process.env.A as string;",
			"export const B = process.env.B as string;",
			"",
		].join("\n"),
	);
});

it("should prepend prefix", () => {
	const prefix = "/* eslint-disable */";
	expect(generate("", { prefix })).toBe(prefix + "\n");
});

it("should change eol", () => {
	expect(generate("", { eol: "\r\n" })).toBe(
		"/* Auto generated by typedotenv */\r\n",
	);
});

it("should change env object", () => {
	expect(generate("A=", { envObject: "import.meta.env" })).toBe(
		"/* Auto generated by typedotenv */\nexport const A = import.meta.env.A as string;\n",
	);
});
