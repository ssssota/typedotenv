import { useCallback } from "preact/hooks";
import type { JSXInternal } from "preact/src/jsx";
import classes from "./index.module.css";

type Props = {
	value: string;
	onChange?: (val: string) => unknown;
	readonly?: boolean;
};

export function Editor({ value, onChange, readonly }: Props) {
	const onInput: JSXInternal.GenericEventHandler<HTMLTextAreaElement> =
		useCallback((ev) => onChange?.(ev.currentTarget.value), [onChange]);
	return (
		<textarea
			readOnly={readonly}
			value={value}
			onInput={onInput}
			class={classes.textarea}
		/>
	);
}
