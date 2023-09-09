<script lang="ts">
	import { get } from "svelte/store"
	import { page } from "$app/stores"

	export let address: string
	export let label: string
	export let icon: string

	$: isActive = address === get(page).url.pathname
	$: current = (isActive ? "page" : null) as "page"|null
	$: itemClass = [
		"mdc-deprecated-list-item",
		isActive ? "mdc-deprecated-list-item--activated" : false
	].filter(Boolean).join(" ")
</script>

<a
	class={itemClass}
	href={address}
	aria-current={current}>
	<span class="mdc-deprecated-list-item__ripple"></span>
	<i class="mdc-deprecated-list-item__graphic" aria-hidden="true">{icon}</i>
	<span class="mdc-deprecated-list-item__text">{label}</span>
</a>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/list";

	@include list.deprecated-core-styles;
</style>
