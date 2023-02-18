import classes from "./app.module.css";
import { Header } from "./components/header";
import { Playground } from "./components/playground";

export function App() {
	return (
		<div class={classes.container}>
			<Header />
			<Playground />
		</div>
	);
}
