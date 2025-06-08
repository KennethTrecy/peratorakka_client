<script lang="ts">
import type { Snippet } from "svelte"
import { onMount, onDestroy, setContext } from "svelte"

import makeGlobalContext from "$/make_global_context"
import makeShellContext from "%/shell/make_shell_context"
import { GLOBAL_CONTEXT, SHELL_CONTEXT } from "#/contexts"

import TopAppBar from "%/shell/top_app_bar.svelte"
import NavigationDrawer from "%/shell/navigation_drawer.svelte"

const globalContext = makeGlobalContext()

let { main }: { main: Snippet } = $props()

let isMenuShown = $state(false)

setContext(GLOBAL_CONTEXT, globalContext)
setContext(SHELL_CONTEXT, makeShellContext(globalContext))

onMount(() => {
	(globalContext.initializeGlobalStates as () => void)()
})

onDestroy(globalContext.unsubscribeWatchedGlobalStates as () => void)
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<script
		src="https://cdn.jsdelivr.net/npm/@materializecss/materialize@2.1.1/dist/js/materialize.min.js"></script>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,1&family=Noto+Color+Emoji&display=swap"
		as="style"/>
</svelte:head>

<div class="shell">
	<TopAppBar bind:isMenuShown={isMenuShown}/>
	<NavigationDrawer bind:isMenuShown={isMenuShown}/>
	<main>
		{@render main()}
	</main>
	<footer>
		<p>
			Copyright © 2025 by Kenneth Trecy Tobias.
		</p>
	</footer>
</div>

<style lang="scss">
@use "@/components/third-party/index";

.shell {
	width: 100%;
	min-height: 100%;

	display: flex;
	flex-flow: column nowrap;

	> main {
		flex: 1;
	}
}

footer {
	padding: 1rem;
	text-align: center;
}
</style>
