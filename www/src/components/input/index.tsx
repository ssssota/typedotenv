import type { JSXInternal } from "preact/src/jsx";
import classes from "./index.module.css";
import type { ComponentProps } from "preact";

export function Input(props: ComponentProps<"input">) {
	return (
		<input
			{...props}
			class={`${classes.input} ${props.class ?? ""} ${props.className ?? ""}`}
		/>
	);
}
