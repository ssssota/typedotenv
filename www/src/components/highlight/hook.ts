import { createHighlighterCoreSync } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import ts from "shiki/langs/typescript.mjs";
import github from "shiki/themes/github-light.mjs";

const highlighter = createHighlighterCoreSync({
	themes: [github],
	langs: [ts],
	engine: createJavaScriptRegexEngine(),
});

export function useHighlightedHtml(code: string) {
	return highlighter.codeToHtml(code, {
		lang: "typescript",
		theme: "github-light",
	});
}
