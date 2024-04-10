import { resolve } from "path"
import adapter from "@sveltejs/adapter-cloudflare"

/** @type {import("@sveltejs/kit").Config} */
const configuration = {
	"kit": {
		"adapter": adapter(),
		"alias": {
			"+/*": resolve("./src/types"),
			"#/*": resolve("./src/constants"),
			"$/*": resolve("./src/components/public"),
			"%/*": resolve("./src/components/private"),
			"!/*": resolve("./src/components/third-party"),
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
