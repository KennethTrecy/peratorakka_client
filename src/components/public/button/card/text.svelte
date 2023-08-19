<script lang="ts">
	import type { ButtonKind } from "+/component"

	import TextButton from "$/button/text.svelte"

	export let label: string
	export let kind: ButtonKind = "button"
	export let disabled: boolean = false
	let otherClasses: string = ""

	export { otherClasses as class }

	$: buttonClasses = [
		"card_action",
		"card_action--button",
		...otherClasses.split(" ")
	].filter(Boolean).join(" ")
</script>

<TextButton
	{label}
	{kind}
	{disabled}
	class={buttonClasses}
	on:click/>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";

	@include card.core-styles;

	:global(.card_action) {
		@extend .mdc-card__action;
	}

	:global(.card_action--button) {
		@extend .mdc-card__action--button;
	}
</style>
