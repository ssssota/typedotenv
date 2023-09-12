import { useHighlightedHtml } from "./hook";
import classes from "./index.module.css";

type Props = {
	code: string;
	options: {};
};

export function Highlight({ code, options }: Props) {
	const html = useHighlightedHtml(code, options);
	return (
		<div
			class={classes.container}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: html.value }}
		/>
	);
}
