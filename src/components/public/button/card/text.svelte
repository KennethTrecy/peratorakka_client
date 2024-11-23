<script lang="ts">
import type { ButtonKind } from "+/component"

import TextButton from "$/button/text.svelte"

export let label: string
export let kind: ButtonKind = "button"
export let disabled: boolean = false
let otherClasses: string = ""

export { otherClasses as class }

$: buttonClasses = [
	"text",
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
@use "@/components/third-party/index";
</style>
