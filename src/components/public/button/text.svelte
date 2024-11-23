<script lang="ts">
import type { ButtonKind } from "+/component"

export let label: string
export let kind: ButtonKind = "button"
export let disabled: boolean = false
let otherClasses: string = ""

export { otherClasses as class }

$: buttonClasses = [
	"btn",
	...otherClasses.split(" ")
].filter(Boolean).join(" ")
</script>

<button
	type={kind}
	{disabled}
	class={buttonClasses}
	on:click>
	<span>{label}</span>
</button>

<style lang="scss">
@use "@/components/third-party/index";
</style>
