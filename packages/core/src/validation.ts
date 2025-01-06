import type { DotenvParseOutput } from "dotenv";
import type { PropertyOptions } from "./options";

export class ValidationError extends Error {}

/**
 * Validation keys or values
 * @param parsed Parsed dotenv
 * @param options Property options
 * @throws {ValidationError} If not allowed key or value found
 */
export const validation = (
	parsed: DotenvParseOutput,
	{ allowList, denyList, required, patterns }: PropertyOptions,
) => {
	if (allowList) {
		const notAllowed = Object.keys(parsed).filter(
			(key) => !allowList.includes(key),
		);
		if (notAllowed.length > 0)
			throw new ValidationError(
				`Not allowed key found: ${notAllowed.join(", ")}`,
			);
	}
	if (denyList) {
		const denied = denyList.filter((key) => typeof parsed[key] === "string");
		if (denied.length > 0)
			throw new ValidationError(`Denied key found: ${denied.join(", ")}`);
	}
	if (required) {
		const notIncluded = required.filter(
			(key) => typeof parsed[key] === "undefined",
		);
		if (notIncluded.length > 0)
			throw new ValidationError(
				`Required keys are not included: ${notIncluded.join(", ")}`,
			);
	}
	if (patterns) {
		const notMatched = Object.entries(patterns)
			.filter(([key, pattern]) => {
				const value = parsed[key];
				if (typeof value === "undefined") return false;
				return !value.match(new RegExp(pattern));
			})
			.map(([k]) => k);
		if (notMatched.length > 0)
			throw new ValidationError(`Not allowed pattern found: ${notMatched}`);
	}
};
