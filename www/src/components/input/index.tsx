import type { JSXInternal } from "preact/src/jsx";
import classes from "./index.module.css";

export function Input(props: JSXInternal.HTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			class={`${classes.input} ${props.class ?? ""} ${props.className ?? ""}`}
		/>
	);
}
