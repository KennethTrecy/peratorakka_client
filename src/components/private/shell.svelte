<script lang="ts">
	import { onMount, onDestroy } from "svelte"

	import { DARK_MODE, mustBeInDarkMode, unsubscribeWatchedStates } from "%/shell/state"

	import AppName from "%/shell/app_name.svelte"
	import InnerShell from "%/shell/inner_shell.svelte"

	let isMenuShown = false
	let isInDarkMode = true

	onMount(() => {
		// @ts-ignore
		window.ui("theme", "/logo.png")
		// @ts-ignore
		isInDarkMode = window.ui("mode") === DARK_MODE
	})

	$: mustBeInDarkMode.set(isInDarkMode)
	$: modeIcon = isInDarkMode ? "dark_mode" : "light_mode"

	function toggleMenu() {
		isMenuShown = !isMenuShown
	}

	function toggleMode() {
		isInDarkMode = !isInDarkMode
	}

	onDestroy(unsubscribeWatchedStates)
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
				<i>{modeIcon}</i>
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
