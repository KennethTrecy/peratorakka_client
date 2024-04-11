import { type UserConfig } from "vite"

import { sveltekit } from "@sveltejs/kit/vite"

const configuration: UserConfig = {
	"plugins": [
		sveltekit()
	],
	"server": {
		"port": Number(process.env.PORT || "6014"),
		"hmr": {
			"clientPort": 6014,
			"port": 6014,
			"host": "localhost",
			"protocol": "ws"
		}
	},
	"test": {
		"include": [ "src/**/*.spec.ts" ]
	}
}

export default configuration
