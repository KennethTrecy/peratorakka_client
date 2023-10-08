<script lang="ts">
	import type { MenuItemInfo } from "%/shell/types"

	import { onMount, onDestroy } from "svelte"
	import { MDCDrawer } from "@material/drawer"
	import { afterNavigate } from "$app/navigation"

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

	afterNavigate(close)
	onMount(() => {
		drawerInstance = MDCDrawer.attachTo(drawer as HTMLElement)
	})

	let lastMenuItemInfos: MenuItemInfo[] = []
	onDestroy(menuItemInfos.subscribe(newMenuItemInfos => {
		lastMenuItemInfos = newMenuItemInfos as MenuItemInfo[]
	}))
</script>

<aside class={drawerClasses} bind:this={drawer}>
	<div class="mdc-drawer__content">
		<nav class="mdc-deprecated-list">
			<Item
				address="/profile"
				icon="user"
				label="Profile"/>
			<hr class="mdc-deprecated-list-divider">
			{#each lastMenuItemInfos as info(info.link)}
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
