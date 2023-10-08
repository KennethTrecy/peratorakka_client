<script lang="ts">
	import { onMount, onDestroy, setContext } from "svelte"

	import makeGlobalContext from "$/make_global_context"
	import makeShellContext from "%/shell/make_shell_context"
	import { GLOBAL_CONTEXT, SHELL_CONTEXT } from "#/contexts"

	import TopAppBar from "%/shell/top_app_bar.svelte"
	import NavigationDrawer from "%/shell/navigation_drawer.svelte"

	const globalContext = makeGlobalContext()

	export let isMenuShown = false

	setContext(GLOBAL_CONTEXT, globalContext)
	setContext(SHELL_CONTEXT, makeShellContext(globalContext))

	onMount(() => {
		(globalContext.initializeGlobalStates as () => void)()
	})

	onDestroy(globalContext.unsubscribeWatchedGlobalStates as () => void)

	/**
	 * Previous main
	 * <InnerShell {isMenuShown} on:toggleMenu={toggleMenu}>
	 * </InnerShell>
	 */
</script>

<svelte:head>
	<style>
		* {
			box-sizing: border-box;
			padding: 0em;
			border: 0em;
			margin: 0em;
		}
	</style>
</svelte:head>

<div class="shell">
	<TopAppBar bind:isMenuShown={isMenuShown}/>
	<NavigationDrawer bind:isMenuShown={isMenuShown}/>
	<main class="mdc-top-app-bar--fixed-adjust">
		<slot name="main"></slot>
	</main>
	<footer class="mdc-typography">
		<p class="mdc-typography--body2">
			Copyright © 2023 by Kenneth Trecy Tobias.
		</p>
	</footer>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/typography/mdc-typography";
	@use "@material/top-app-bar/mdc-top-app-bar";

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
