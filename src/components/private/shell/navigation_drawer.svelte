<script lang="ts">
import type { Readable } from "svelte/store"
import type { MenuItemInfo } from "%/shell/types"
import type { ContextBundle } from "+/component"

import { onMount, onDestroy, getContext } from "svelte"
import { afterNavigate } from "$app/navigation"

import { GLOBAL_CONTEXT, SHELL_CONTEXT } from "#/contexts"

import NavigationListCollection from "%/shell/navigation_list_collection.svelte"

const {
	userEmail
} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
	userEmail: Readable<string>
}

const shell = getContext(SHELL_CONTEXT) as ContextBundle
const menuItemInfos = shell.menuItemInfos as Readable<MenuItemInfo[]>

export let isMenuShown: boolean

function close() {
	isMenuShown = false
}

afterNavigate(close)

let sideNavigator: HTMLUListElement
onMount(() => {
	// @ts-ignore
	var instances = window.M.Sidenav.init([ sideNavigator ], {
		// specify options here
	});
})
let lastMenuItemInfos: MenuItemInfo[] = []
onDestroy(menuItemInfos.subscribe(newMenuItemInfos => {
	lastMenuItemInfos = newMenuItemInfos as MenuItemInfo[]
}))
</script>

<ul class="sidenav" id="mobile-dropdown" bind:this={sideNavigator}>
	<li>
		<div class="user-view">
			<span class="name">Current User</span>
			<span class="email">{$userEmail}</span>
		</div>
	</li>
	<NavigationListCollection {isMenuShown}/>
</ul>

<style lang="scss">
@use "@/components/third-party/index";
</style>
