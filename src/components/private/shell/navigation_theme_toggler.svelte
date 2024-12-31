<script lang="ts">
import type { Readable, Writable } from "svelte/store"
import type { ContextBundle } from "+/component"

import { onMount, getContext } from "svelte"

import { GLOBAL_CONTEXT } from "#/contexts"
import { DARK_MODE, LIGHT_MODE } from "#/theme"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

$: themeName = globalContext.themeName as Writable<string>
$: mustBeInDarkMode = globalContext.mustBeInDarkMode as Readable<boolean>

$: if (typeof window !== "undefined") {
	document.documentElement.setAttribute(
		"theme",
		$themeName
	)
}
$: modeIcon = $mustBeInDarkMode ? "dark_mode" : "light_mode"
$: currentTheme = $mustBeInDarkMode ? DARK_MODE : LIGHT_MODE

onMount(() => {
	$themeName = document.documentElement.getAttribute("theme") ?? LIGHT_MODE
})

function toggleThemeThoughMouse(event: MouseEvent): void {
	event.preventDefault()
	$themeName = $themeName === DARK_MODE ? LIGHT_MODE : DARK_MODE
}

</script>

<li>
	<a
		href="?"
		tabindex="0"
		role="switch"
		aria-checked={$mustBeInDarkMode}
		data-set-theme={currentTheme}
		data-act-class={LIGHT_MODE}
		aria-label="Toggle theme"
		on:click={toggleThemeThoughMouse}
		class="normal">
		<i class="material-icons" aria-hidden="true">{modeIcon}</i>
		<span>{$mustBeInDarkMode ? "Dark" : "Light"}</span>
	</a>
</li>

<style lang="scss">
@use "@/components/third-party/index";

a.normal {
	display: flex;
	flex-flow: row nowrap;
	gap: 0.5rem;
}
</style>
