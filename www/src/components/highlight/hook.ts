import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { highlighter } from "../../signals/highlighter";

export function useHighlightedHtml(code: string, options: {}) {
	const html = useSignal("");
	useEffect(() => {
		html.value = highlighter.value?.codeToHtml(code, options) ?? "";
	}, [code, options]);
	useSignalEffect(() => {
		html.value = highlighter.value?.codeToHtml(code, options) ?? "";
	});
	return html;
}
