import { expect, it } from "vitest";
import { validation } from "./validation";

it("should not throw", () => {
	expect(validation({}, {})).toBe(undefined);
	expect(validation({}, { allowList: ["test"] })).toBe(undefined);
	expect(validation({}, { denyList: ["test"] })).toBe(undefined);
	expect(validation({ KEY: "val" }, { required: ["KEY"] })).toBe(undefined);
	expect(
		validation(
			{ A: "abc", B: "DEF" },
			{ patterns: { A: "^a.*c$", B: /def/i, C: "^$" } },
		),
	).toBe(undefined);
});

it("should throw ValidationError because allowList", () => {
	expect(() =>
		validation({ A: "", B: "", C: "" }, { allowList: ["B"] }),
	).toThrowErrorMatchingInlineSnapshot('"Not allowed key found: A, C"');
	expect(() =>
		validation({ A: "", B: "", C: "" }, { allowList: ["B", "C"] }),
	).toThrowErrorMatchingInlineSnapshot('"Not allowed key found: A"');
	expect(() =>
		validation({ A: "", B: "", C: "" }, { allowList: ["B", "D"] }),
	).toThrowErrorMatchingInlineSnapshot('"Not allowed key found: A, C"');
});

it("should throw ValidationError because denyList", () => {
	expect(() =>
		validation({ A: "", B: "", C: "" }, { denyList: ["A"] }),
	).toThrowErrorMatchingInlineSnapshot('"Denied key found: A"');
	expect(() =>
		validation({ A: "", B: "", C: "" }, { denyList: ["A", "B"] }),
	).toThrowErrorMatchingInlineSnapshot('"Denied key found: A, B"');
	expect(() =>
		validation({ A: "", B: "", C: "" }, { denyList: ["A", "D"] }),
	).toThrowErrorMatchingInlineSnapshot('"Denied key found: A"');
});

it("should throw ValidationError because required", () => {
	expect(() =>
		validation({ A: "", B: "", C: "" }, { required: ["D"] }),
	).toThrowErrorMatchingInlineSnapshot('"Required keys are not included: D"');
	expect(() =>
		validation({ A: "", B: "", C: "" }, { required: ["A", "E"] }),
	).toThrowErrorMatchingInlineSnapshot('"Required keys are not included: E"');
});

it("should throw ValidationError because patterns", () => {
	expect(() =>
		validation({ A: "a" }, { patterns: { A: "b" } }),
	).toThrowErrorMatchingInlineSnapshot('"Not allowed pattern found: A"');
	expect(() =>
		validation({ A: "a" }, { patterns: { A: /A/ } }),
	).toThrowErrorMatchingInlineSnapshot('"Not allowed pattern found: A"');
	expect(() =>
		validation({ A: "a", B: "b" }, { patterns: { B: /a/ } }),
	).toThrowErrorMatchingInlineSnapshot('"Not allowed pattern found: B"');
});
