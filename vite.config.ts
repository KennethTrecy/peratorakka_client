import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { resolve } from "path";

export default defineConfig({
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
		"include": [ "t/**/*.ts" ]
	}
});
