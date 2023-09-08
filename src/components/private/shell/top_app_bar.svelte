<script lang="ts">
	import { onMount } from "svelte"
	import { MDCTopAppBar } from "@material/top-app-bar"

	import { mustBeInDarkMode } from "%/shell/state"

	import AppName from "%/shell/top_app_bar/app_name.svelte"
	import NavigationButton from "%/shell/top_app_bar/navigation.svelte"
	import ActionItemButton from "%/shell/top_app_bar/action_item.svelte"

	export let isMenuShown: boolean

	let topAppBar: HTMLElement|null = null
	let topAppBarInstance: MDCTopAppBar

	function toggleMenu() {
		isMenuShown = !isMenuShown
	}

	function toggleMode() {
		mustBeInDarkMode.update(isInDarkMode => !isInDarkMode)
	}

	onMount(() => {
		topAppBarInstance = new MDCTopAppBar(topAppBar as HTMLElement)
	})
</script>

<header class="mdc-top-app-bar" bind:this={topAppBar}>
	<div class="mdc-top-app-bar__row">
		<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
			<NavigationButton
				label="Open navigation menu"
				icon="menu"
				on:click={toggleMenu}/>
			<AppName/>
		</section>
		<section
			class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
			role="toolbar">
			<ActionItemButton
				label="Toggle theme mode"
				icon={$mustBeInDarkMode ? "dark_mode" : "light_mode"}
				on:click={toggleMode}/>
		</section>
	</div>
</header>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/top-app-bar/mdc-top-app-bar";
</style>
