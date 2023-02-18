import type { ReadonlySignal } from "@preact/signals";
import { signal } from "@preact/signals";
import type { Highlighter } from "shiki";
import { getHighlighter } from "shiki";

const _highlighter = signal<Highlighter | undefined>(undefined);
getHighlighter({
	theme: "github-light",
	langs: ["ts"],
	paths: {
		wasm: "shiki/",
		themes: "shiki/",
		languages: "shiki/",
	},
}).then((h) => (_highlighter.value = h));
export const highlighter: ReadonlySignal<Highlighter | undefined> =
	_highlighter;
