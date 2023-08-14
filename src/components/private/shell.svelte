<script lang="ts">
	import { onMount, onDestroy } from "svelte"
	import { MDCTopAppBar } from "@material/top-app-bar";

	import { initializeGlobalStates, unsubscribeWatchedGlobalStates } from "$/global_state"
	import { setTheme } from "@/components/third-party/index"
	import {
		initializeShellState,
		mustBeInDarkMode,
		unsubscribeWatchedStates
	} from "%/shell/state"

	import AppName from "%/shell/app_name.svelte"

	let topAppBar: HTMLElement|null = null
	let topAppBarInstance: MDCTopAppBar
	let isMenuShown = false

	onMount(() => {
		setTheme("/logo.png")
		initializeShellState()
		initializeGlobalStates()
	})

	function toggleMenu() {
		isMenuShown = !isMenuShown
	}

	function toggleMode() {
		mustBeInDarkMode.update(isInDarkMode => !isInDarkMode)
	}

	onMount(() => {
		topAppBarInstance = new MDCTopAppBar(topAppBar as HTMLElement)
	})
	onDestroy(unsubscribeWatchedStates)
	onDestroy(unsubscribeWatchedGlobalStates)

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
	<header class="mdc-top-app-bar" bind:this={topAppBar}>
		<div class="mdc-top-app-bar__row">
			<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
				<button
					class="mdc-top-app-bar__navigation-icon mdc-icon-button"
					aria-label="Open navigation menu"
					on:click={toggleMenu}>
					<i>menu</i>
				</button>
				<AppName/>
			</section>
			<section
				class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
				role="toolbar">
				<button
					class="mdc-top-app-bar__action-item mdc-icon-button"
					aria-label="Toggle theme mode"
					on:click={toggleMode}>
					<i>{$mustBeInDarkMode ? "dark_mode" : "light_mode"}</i>
				</button>
			</section>
		</div>
	</header>
	<main class="mdc-top-app-bar--fixed-adjust">
		<slot name="main"></slot>
	</main>
</div>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/icon-button/styles";
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
	}
</style>
