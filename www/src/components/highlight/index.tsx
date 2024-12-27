import { useHighlightedHtml } from "./hook";
import classes from "./index.module.css";

type Props = {
	code: string;
};

export function Highlight({ code }: Props) {
	const html = useHighlightedHtml(code);
	return (
		<div
			class={classes.container}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
