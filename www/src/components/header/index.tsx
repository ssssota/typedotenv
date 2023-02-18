import { VITE_DESCRIPTION } from "../../env";
import { GitHub } from "./github";
import classes from "./index.module.css";
import { Npm } from "./npm";

export function Header() {
	return (
		<div class={classes.container}>
			<h1 class={classes.title}>
				<img src={`${import.meta.env.BASE_URL}/typedotenv.svg`} alt="" />
				<div>typedotenv</div>
			</h1>
			<p>{VITE_DESCRIPTION}</p>
			<nav class={classes.navigation}>
				<a
					href="https://github.com/ssssota/typedotenv"
					target="_blank"
					rel="noreferrer"
				>
					<GitHub size={24} />
				</a>
				<a
					href="https://www.npmjs.com/package/unplugin-typedotenv"
					target="_blank"
					rel="noreferrer"
				>
					<Npm size={24} />
				</a>
			</nav>
		</div>
	);
}
