<script lang="ts">
	import { onMount } from "svelte"
	import { MDCDrawer } from "@material/drawer"

	import { menuItemInfos } from "%/shell/state"

	import Item from "%/shell/navigation_drawer/item.svelte"

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

	function close() {
		isMenuShown = false
	}

	onMount(() => {
		drawerInstance = MDCDrawer.attachTo(drawer as HTMLElement)
	})
</script>

<aside class={drawerClasses} bind:this={drawer}>
	<div class="mdc-drawer__content">
		<nav class="mdc-deprecated-list">
			{#each $menuItemInfos as info(info.link)}
				<Item
					address={info.link}
					icon={info.icon}
					label={info.label}/>
			{/each}
		</nav>
	</div>
 </aside>
 <button
 	class="mdc-drawer-scrim"
	on:click={close}></button>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/drawer";
	@use "@material/list";

	@include drawer.core-styles;
	@include drawer.modal-core-styles;
	@include list.deprecated-core-styles;
</style>
