import beercss from "beercss/src/cdn/beer"
import materialDynamicColors from "material-dynamic-colors/src/cdn/material-dynamic-colors.js"

export function setTheme(filename: string): void {
	beercss("theme", filename)
}

export function setMode(modeName: string): void {
	beercss("mode", modeName)
}
