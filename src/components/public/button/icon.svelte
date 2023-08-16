<script lang="ts">
	import { onMount } from "svelte"
	import { MDCRipple } from "@material/ripple"

	export let label: string
	export let icon: string
	let otherClasses: string

	export { otherClasses as class }

	$: buttonClasses = [
		"mdc-icon-button",
		...otherClasses.split(" ")
	].filter(Boolean).join(" ")

	let buttonElement: any
	onMount(() => {
		const button = new MDCRipple(buttonElement)
		button.unbounded = true
	})
</script>

<button
	class={buttonClasses}
	aria-label={label}
	on:click
	bind:this={buttonElement}>
	<div class="mdc-icon-button__ripple"></div>
	<span class="mdc-icon-button__focus-ring"></span>
	<i>{icon}</i>
</button>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/icon-button/styles";
</style>
