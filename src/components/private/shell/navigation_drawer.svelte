<script lang="ts">
	import { onMount } from "svelte"
	import { MDCDrawer } from "@material/drawer"

	export let isMenuShown: boolean
	let drawer: HTMLElement|null = null
	let drawerInstance: MDCDrawer

	$: {
		if (drawerInstance) {
			drawerInstance.open = isMenuShown
		}
	}
	$: drawerClasses = [
		"mdc-drawer",
		"mdc-drawer--modal",
		...(
			typeof drawerInstance === "undefined"
				? [
					"mdc-drawer--open",
					"mdc-drawer--opening",
					"mdc-drawer--closing"
				]
				: []
		)
	].join(" ")

	onMount(() => {
		drawerInstance = MDCDrawer.attachTo(drawer as HTMLElement)
		drawerInstance.initialize()
	})
</script>

<aside class={drawerClasses} bind:this={drawer}>
	<div class="mdc-drawer__content">
		<nav class="mdc-deprecated-list">
		</nav>
	</div>
 </aside>
 <div class="mdc-drawer-scrim"></div>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/drawer";
	@use "@material/list";

	@include drawer.core-styles;
	@include drawer.modal-core-styles;
	@include list.deprecated-core-styles;
</style>
