<script lang="ts">
import type { MenuItemInfo, MenuGroupInfo } from "%/shell/types"

import { get } from "svelte/store"
import { page } from "$app/stores"
import { afterNavigate } from "$app/navigation"
import { onMount } from "svelte"

import NavigationItem from "%/shell/navigation_item.svelte"
import NavigationGroup from "%/shell/navigation_group.svelte"

export let label: string
export let icon: string
export let items: (MenuItemInfo|MenuGroupInfo)[]
let currentAddress = ""

function hasActiveAddress(infos: (MenuItemInfo|MenuGroupInfo)[], currentAddress: string) {
	for (const info of infos) {
		if (info.type === "item" && info.link === currentAddress) {
			return true
		} else if (info.type === "group") {
			if (hasActiveAddress(info.items, currentAddress)) {
				return true
			}
		}
	}

	return false
}

$: console.log(items)
$: isActive = hasActiveAddress(items, currentAddress)
$: current = (isActive ? "page" : null) as "page"|null
$: itemClass = [
	"dropdown-trigger",
	isActive ? "active" : "normal"
].filter(Boolean).join(" ")
$: id = label.replace(" ", "_").toLocaleLowerCase()+"-dropdown-"+Math.round(Math.random()*1_000_000)
$: bookmark = `#${id}`

afterNavigate(() => {
	currentAddress = get(page).url.pathname
})

let dropdownNavigatorTriggerElement: HTMLAnchorElement|null = null
onMount(() => {
	if (dropdownNavigatorTriggerElement !== null) {
		// @ts-ignore
		M.Dropdown.init([ dropdownNavigatorTriggerElement ], {
			"constrainWidth": false,
			"coverTrigger": false,
			"closeOnClick": false
		});
	}
})
$: {
	if (dropdownNavigatorTriggerElement !== null) {
		setTimeout(() => {
			if (dropdownNavigatorTriggerElement === null) return

			// @ts-ignore
			M.Dropdown.getInstance(dropdownNavigatorTriggerElement).destroy()

			// @ts-ignore
			M.Dropdown.init([ dropdownNavigatorTriggerElement ], {
				"constrainWidth": false,
				"coverTrigger": false,
				"closeOnClick": false
			});
		}, 250)
	}
}
</script>

<li>
	<a
		class={itemClass}
		aria-current={current}
		data-target={id}
		href={bookmark}
		bind:this={dropdownNavigatorTriggerElement}>
		<i class="material-icons" aria-hidden="true">{icon}</i>
		<span>{label}</span>
		<i class="material-icons right">arrow_drop_down</i>
	</a>
	<ul {id} class="dropdown-content">
		{#each items as info}
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
	</ul>
</li>

<style lang="scss">
@use "@/components/third-party/index";

.normal, .active {
	display: flex;
	flex-flow: row nowrap;
	gap: 0.5rem;
}

li.dropdown-content ul :global(li a i.material-icons) {
	height: initial;
	margin: 0px;
}
</style>
