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

let { isMenuShown = $bindable() }: {
	isMenuShown: boolean
} = $props()

function close() {
	isMenuShown = false
}

afterNavigate(close)

let sideNavigator: HTMLUListElement|null = $state(null)

onMount(() => {
	// @ts-ignore
	let instances = window.M.Sidenav.init([ sideNavigator ], {
		// specify options here
	})
})
</script>

<ul class="sidenav" id="mobile-dropdown" bind:this={sideNavigator}>
	<li>
		<div class="user-view">
			{#if $userEmail === ""}
				<span class="name">Guest mode</span>
				<span class="email">You are not yet identified by the server.</span>
			{:else}
				<span class="name">Current User</span>
				<span class="email">{$userEmail}</span>
			{/if}
		</div>
	</li>
	<NavigationListCollection {isMenuShown}/>
</ul>
