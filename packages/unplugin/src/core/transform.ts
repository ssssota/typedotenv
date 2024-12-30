import { buildEnvReference } from "@typedotenv/core";
import MagicString from "magic-string";
import type { TransformResult } from "unplugin";
import type { Options } from "./options";

export const createTransform =
	(options: Options, vars: readonly string[]) =>
	(code: string): TransformResult => {
		const s = new MagicString(code);
		for (const env of vars) {
			const reg = new RegExp(`\\b${env}\\b`, "g");
			s.replaceAll(reg, buildEnvReference(options, env));
		}

		return { code: s.toString(), map: s.generateMap() };
	};
