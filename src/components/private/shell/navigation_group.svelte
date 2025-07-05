<script lang="ts">
import type { MenuItemInfo, MenuGroupInfo } from "%/shell/types"

import { page } from "$app/state"
import { afterNavigate } from "$app/navigation"
import { onMount } from "svelte"

import NavigationItem from "%/shell/navigation_item.svelte"
import NavigationGroup from "%/shell/navigation_group.svelte"

let { label, icon, items }: {
	label: string
	icon: string
	items: (MenuItemInfo|MenuGroupInfo)[]
} = $props()
let currentAddress = $state("")

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

let isActive = $derived(hasActiveAddress(items, currentAddress))
let current = $derived((isActive ? "page" : null) as "page"|null)
let itemClass = $derived([
	"dropdown-trigger",
	isActive ? "active" : "normal"
].filter(Boolean).join(" "))
let labelClass = $derived(label.includes(" ") ? "wrap" : null)
let id = $derived(
	label.replace(" ", "_").toLocaleLowerCase()
	+ "-dropdown-"
	+ Math.round(Math.random()*1_000_000)
)
let bookmark = $derived(`#${id}`)

afterNavigate(() => {
	currentAddress = page.url.pathname
})

let dropdownNavigatorTriggerElement: HTMLAnchorElement|null = $state(null)
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
$effect(() => {
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
});
</script>

<li>
	<a
		class={itemClass}
		aria-current={current}
		data-target={id}
		href={bookmark}
		bind:this={dropdownNavigatorTriggerElement}>
		<i class="material-icons" aria-hidden="true">{icon}</i>
		<span class={labelClass}>{label}</span>
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
li {
	.normal, .active {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.5rem;

		> i {
			display: block;
			float: none;
			height: unset;
		}
	}

	@media only screen and (min-width: 993px) and (max-width: 1599px) {
		flex-grow: 1;

		.normal, .active {
			justify-content: center;
		}
	}
}

li ul.dropdown-content {
	:global(li a) {
		@media only screen and (min-width: 993px) and (max-width: 1599px) {
			justify-content: left;
		}
	}

	:global(li a > i.material-icons) {
		margin-right: 0;
	}
}
</style>
