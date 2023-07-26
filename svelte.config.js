import { resolve } from "path"
import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/kit/vite"

/** @type {import("@sveltejs/kit").Config} */
const configuration = {
	"preprocess": vitePreprocess(),

	"kit": {
		"adapter": adapter(),
		"alias": {
			"@/*": resolve("./src"),
			"~/*": resolve("./t")
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
