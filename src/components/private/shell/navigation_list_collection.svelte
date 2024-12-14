<script lang="ts">
import type { Readable } from "svelte/store"
import type { MenuItemInfo, MenuGroupInfo } from "%/shell/types"
import type { ContextBundle } from "+/component"

import { onDestroy, getContext } from "svelte"
import { afterNavigate } from "$app/navigation"

import { SHELL_CONTEXT } from "#/contexts"

import NavigationItem from "%/shell/navigation_item.svelte"
import NavigationGroup from "%/shell/navigation_group.svelte"

const shell = getContext(SHELL_CONTEXT) as ContextBundle
const menuItemInfos = shell.menuItemInfos as Readable<MenuItemInfo[]>

export let isMenuShown: boolean

function close() {
	isMenuShown = false
}

afterNavigate(close)

let lastMenuItemInfos: (MenuItemInfo|MenuGroupInfo)[] = []
onDestroy(menuItemInfos.subscribe(newMenuItemInfos => {
	lastMenuItemInfos = newMenuItemInfos as MenuItemInfo[]
}))
</script>

{#each lastMenuItemInfos as info}
	{#if info.type === "item"}
		<NavigationItem
			address={info.link}
			icon={info.icon}
			label={info.label}/>
	{:else if info.type === "group"}
		<NavigationGroup
			icon={info.icon}
			label={info.label}
			items={info.items}/>
	{/if}
{/each}

<style lang="scss">
@use "@/components/third-party/index";
</style>
