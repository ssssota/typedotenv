import MagicString, { type SourceMap } from "magic-string";
import { virtualModuleName } from "./constants";
import { buildEnvReference } from "./generate";
import type { GenerateOptions } from "./options";

const SP = "[ \\t]";
const importReg = new RegExp(
	`import${SP}*(.+?)${SP}*from${SP}*(["'])${virtualModuleName}\\2(${SP}*assert${SP}*{.+?})?;?`,
);

export type TransformResult = { code: string; map: SourceMap } | null;

export function createTransform(options: GenerateOptions) {
	if (options.mode !== "declaration") return (_code: string) => null;
	return (code: string): TransformResult => {
		if (!code.includes(virtualModuleName)) return null;

		const importDeclaration = code.match(importReg);
		if (!importDeclaration) return null;

		const importClause = importDeclaration[1].trim();

		const nameSpaceImport = importClause.match(/\*[ \t]*as[ \t]+(\w+)/);
		if (nameSpaceImport)
			return transformNameSpaceImport(options, code, nameSpaceImport[1]);
		const namedImports = importClause.match(/{(.+)}/);
		if (namedImports)
			return transformNamedImports(
				options,
				code,
				namedImports[1].split(",").map((x) => x.trim()),
			);

		// default import is not supported (env has no default export)
		return null;
	};
}

function transformNameSpaceImport(
	options: GenerateOptions,
	code: string,
	nameSpaceImport: string,
): TransformResult {
	const s = new MagicString(code);
	s.replace(importReg, "");
	const dot = new RegExp(`\\b${nameSpaceImport}${SP}*\\.${SP}*(\\w+)\\b`, "g");
	s.replaceAll(dot, buildEnvReference(options, "$1"));

	const index = new RegExp(
		`\\b${nameSpaceImport}${SP}*\\[${SP}*(['"\`])(.+?)\\1${SP}*\\]`,
		"g",
	);
	s.replaceAll(index, buildEnvReference(options, "$2"));
	return { code: s.toString(), map: s.generateMap() };
}
function transformNamedImports(
	options: GenerateOptions,
	code: string,
	namedImports: readonly string[],
): TransformResult {
	const s = new MagicString(code);
	for (const env of namedImports) {
		const reg = new RegExp(`\\b${env}\\b`, "g");
		s.replaceAll(reg, buildEnvReference(options, env));
	}
	s.replace(importReg, "");
	return { code: s.toString(), map: s.generateMap() };
}
