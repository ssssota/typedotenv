import { Editor } from "../editor";
import { Highlight } from "../highlight";
import { Input } from "../input";
import { useTypedotenv } from "./hook";
import classes from "./index.module.css";

export function Playground() {
	const {
		dotenv,
		options,
		result,
		onChange,
		onChangeAllowList,
		onChangeDenyList,
		onChangeRequired,
	} = useTypedotenv("TEST=value");
	return (
		<form class={classes.container} onSubmit={(e) => e.preventDefault()}>
			<section class={classes.input}>
				<Editor value={dotenv.value} onChange={onChange} />
				<ul>
					<li>
						Env object
						<br />
						<Input
							value={options.value.envObject ?? ""}
							onInput={(ev) => {
								options.value = {
									...options.value,
									envObject: ev.currentTarget.value,
								};
							}}
						/>
					</li>
					<li>
						Runtime type check{" "}
						<input
							type="checkbox"
							checked={!options.value.disableRuntimeTypeCheck}
							onChange={(ev) => {
								options.value = {
									...options.value,
									disableRuntimeTypeCheck: !ev.currentTarget.checked,
								};
							}}
						/>
					</li>
					<li>
						Type assetion{" "}
						<input
							type="checkbox"
							checked={options.value.enableTypeAssertion}
							onChange={(ev) => {
								options.value = {
									...options.value,
									enableTypeAssertion: ev.currentTarget.checked,
								};
							}}
						/>
					</li>
					<li>
						Access from index signature{" "}
						<input
							type="checkbox"
							checked={options.value.accessFromIndexSignature}
							onChange={(ev) => {
								options.value = {
									...options.value,
									accessFromIndexSignature: ev.currentTarget.checked,
								};
							}}
						/>
					</li>
					<li>
						Allow list
						<br />
						<Input
							value={options.value.allowList?.join(",") ?? ""}
							onInput={(ev) => {
								const val = ev.currentTarget.value;
								if (val) onChangeAllowList(val.split(",").map((v) => v.trim()));
							}}
						/>
					</li>
					<li>
						Deny list
						<br />
						<Input
							value={options.value.denyList?.join(",") ?? ""}
							onInput={(ev) => {
								const val = ev.currentTarget.value;
								if (val) onChangeDenyList(val.split(",").map((v) => v.trim()));
							}}
						/>
					</li>
					<li>
						Required list
						<br />
						<Input
							value={options.value.required?.join(",") ?? ""}
							onInput={(ev) => {
								const val = ev.currentTarget.value;
								if (val) onChangeRequired(val.split(",").map((v) => v.trim()));
							}}
						/>
					</li>
				</ul>
			</section>
			<output class={classes.output}>
				<Highlight code={result.value} options={{ lang: "ts" }} />
			</output>
		</form>
	);
}
