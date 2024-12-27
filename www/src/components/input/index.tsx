import type { ComponentProps } from "preact";
import type { JSXInternal } from "preact/src/jsx";
import classes from "./index.module.css";

export function Input(props: ComponentProps<"input">) {
	return (
		<input
			{...props}
			class={`${classes.input} ${props.class ?? ""} ${props.className ?? ""}`}
		/>
	);
}
