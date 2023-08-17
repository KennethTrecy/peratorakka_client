<script lang="ts">
	import type { ButtonKind } from "+/component"

	import { onMount } from "svelte"
	import { MDCRipple } from "@material/ripple"

	export let label: string
	export let kind: ButtonKind = "button"
	export let disabled: boolean = false
	let otherClasses: string

	export { otherClasses as class }

	$: buttonClasses = [
		"mdc-button",
		...otherClasses.split(" ")
	].filter(Boolean).join(" ")

	let buttonElement: any
	onMount(() => {
		const button = new MDCRipple(buttonElement)
	})
</script>

<button
	type={kind}
	{disabled}
	class={buttonClasses}
	on:click
	bind:this={buttonElement}>
	<div class="mdc-button__ripple"></div>
	<span class="mdc-button__label">{label}</span>
</button>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/button/styles";
</style>
