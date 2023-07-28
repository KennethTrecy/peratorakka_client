import { resolve } from "path"
import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/kit/vite"

/** @type {import("@sveltejs/kit").Config} */
const configuration = {
	"preprocess": vitePreprocess(),

	"kit": {
		"adapter": adapter(),
		"alias": {
			"+/*": resolve("./src/types"),
			"#/*": resolve("./src/constants"),
			"$/*": resolve("./src/components/public"),
			"%/*": resolve("./src/components/private"),
			"@/*": resolve("./src"),
			"~/*": resolve("./t"),
			"material-symbols-outlined.woff2": resolve("./node_modules/beercss/dist/cdn/material-symbols-outlined.woff2"),
			"material-symbols-rounded.woff2": resolve("./node_modules/beercss/dist/cdn/material-symbols-rounded.woff2"),
			"material-symbols-sharp.woff2": resolve("./node_modules/beercss/dist/cdn/material-symbols-sharp.woff2")
		}
	},

	"onwarn": (warning, handler) => {
		const { code, frame } = warning;
		if (code === "css-unused-selector")
			return;

		handler(warning);
	}
}

export default configuration
