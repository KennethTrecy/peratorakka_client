<script lang="ts">
	import { onMount, onDestroy } from "svelte"

	import { initializeGlobalStates, unsubscribeWatchedGlobalStates } from "$/global_state"
	import { setTheme } from "@/components/third-party/index"
	import {
		initializeShellState,
		mustBeInDarkMode,
		unsubscribeWatchedStates
	} from "%/shell/state"

	import AppName from "%/shell/app_name.svelte"
	import InnerShell from "%/shell/inner_shell.svelte"

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

	onDestroy(unsubscribeWatchedStates)
	onDestroy(unsubscribeWatchedGlobalStates)
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
	<header class="primary-container">
		<nav>
			<button class="s circle transparent" on:click={toggleMenu}>
				<i>menu</i>
			</button>
			<span class="m l circle transparent"></span>
			<p class="max center-align">
				<AppName/>
			</p>
			<button class="circle transparent" on:click={toggleMode}>
				<i>{$mustBeInDarkMode ? "dark_mode" : "light_mode"}</i>
			</button>
		</nav>
	</header>
	<InnerShell {isMenuShown} on:toggleMenu={toggleMenu}>
		<slot name="main"></slot>
	</InnerShell>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	.shell {
		width: 100%;
		height: 100%;

		display: flex;
		flex-flow: column nowrap;

		> main {
			flex: 1;
		}
	}

	[data-app-name] {
		@extend h5;

		margin-left: 0.25em;
	}

	footer {
		padding: 1rem;
	}
</style>
