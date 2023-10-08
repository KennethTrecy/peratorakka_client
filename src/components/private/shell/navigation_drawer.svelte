<script lang="ts">
	import type { Readable } from "svelte/store"
	import type { MenuItemInfo } from "%/shell/types"
	import type { ContextBundle } from "+/component"

	import { onMount, onDestroy, getContext } from "svelte"
	import { MDCDrawer } from "@material/drawer"
	import { afterNavigate } from "$app/navigation"

	import { GLOBAL_CONTEXT, SHELL_CONTEXT } from "#/contexts"

	import Item from "%/shell/navigation_drawer/item.svelte"

	const {
		serverURL,
		userEmail
	} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
		serverURL: Readable<string>,
		userEmail: Readable<string>
	}

	const shell = getContext(SHELL_CONTEXT) as ContextBundle
	const menuItemInfos = shell.menuItemInfos as Readable<MenuItemInfo[]>

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
	{#if $userEmail !== ""}
		<div class="mdc-drawer__header">
			<h5 class="mdc-drawer__title">Current user</h5>
			<h6 class="mdc-drawer__subtitle">{$userEmail}</h6>
		</div>
	{/if}
	<div class="mdc-drawer__content">
		<nav class="mdc-deprecated-list">
			{#each lastMenuItemInfos as info}
				{#if info.type === "item"}
					<Item
						address={info.link}
						icon={info.icon}
						label={info.label}/>
				{:else}
					<hr class="mdc-deprecated-list-divider"/>
				{/if}
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
