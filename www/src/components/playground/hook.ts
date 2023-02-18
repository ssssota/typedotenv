import { useComputed, useSignal } from "@preact/signals";
import type { GenerateOptions } from "@typedotenv/core";
import { generate } from "@typedotenv/core";
import { useCallback } from "preact/hooks";

export function useTypedotenv(initial: string) {
	const options = useSignal<GenerateOptions>({
		envObject: "process.env",
		disableRuntimeTypeCheck: false,
		enableTypeAssertion: false,
	});
	const dotenv = useSignal(initial);
	const result = useComputed(() => {
		try {
			return generate(dotenv.value, options.value);
		} catch (e) {
			return `ERROR!!\n\n${e instanceof Error ? e.message : e}`;
		}
	});
	const onChange = useCallback((val: string) => {
		dotenv.value = val;
	}, []);
	const onChangeAllowList = useCallback((list: string[]) => {
		options.value = {
			...options.value,
			denyList: undefined,
			required: undefined,
			allowList: list,
		};
	}, []);
	const onChangeDenyList = useCallback((list: string[]) => {
		options.value = {
			...options.value,
			denyList: list,
			allowList: undefined,
		};
	}, []);
	const onChangeRequired = useCallback((list: string[]) => {
		options.value = {
			...options.value,
			denyList: list,
			allowList: undefined,
		};
	}, []);
	return {
		dotenv,
		options,
		result,
		onChange,
		onChangeAllowList,
		onChangeDenyList,
		onChangeRequired,
	};
}
