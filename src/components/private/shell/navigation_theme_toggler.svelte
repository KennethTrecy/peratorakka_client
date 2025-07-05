<script lang="ts">
import type { Readable, Writable } from "svelte/store"
import type { ContextBundle } from "+/component"

import { onMount, getContext } from "svelte"

import { GLOBAL_CONTEXT } from "#/contexts"
import { DARK_MODE, LIGHT_MODE } from "#/theme"

const {
	themeName,
	mustBeInDarkMode
} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
	themeName: Writable<string>
	mustBeInDarkMode: Readable<boolean>
}

$effect(() => {
	if (typeof window !== "undefined") {
		document.documentElement.setAttribute(
			"theme",
			$themeName
		)
	}
});
let modeIcon = $derived($mustBeInDarkMode ? "dark_mode" : "light_mode")
let currentTheme = $derived($mustBeInDarkMode ? DARK_MODE : LIGHT_MODE)

onMount(() => {
	$themeName = document.documentElement.getAttribute("theme") ?? LIGHT_MODE
})

function toggleThemeThroughMouse(event: MouseEvent): void {
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
		onclick={toggleThemeThroughMouse}
		class="normal">
		<i class="material-icons" aria-hidden="true">{modeIcon}</i>
		<span>{$mustBeInDarkMode ? "Dark" : "Light"}</span>
	</a>
</li>

<style lang="scss">
li {
	.normal {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.5rem;

		> i {
			display: block;
			float: none;
			height: unset;
		}
	}

	@media only screen and (min-width: 993px) and (max-width: 1599px) {
		flex-grow: 1;

		.normal {
			justify-content: center;
		}
	}
}
</style>
