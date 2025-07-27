<script lang="ts">
import separateNumericParts from "$/utility/separate_numeric_parts"

let { shownAmount }: {
	shownAmount: string
} = $props()

let parts = $derived(separateNumericParts(shownAmount))
let wholePart = $derived(parts[0])
let visibleDecimalPart = $derived(parts[1])
let invisbleDecimalPart = $derived(parts[2])
let postDecimalPart = $derived(parts[3])
</script>

{wholePart}{visibleDecimalPart}{#if invisbleDecimalPart.length > 0}<span>{invisbleDecimalPart}</span>{/if}{postDecimalPart}

<style lang="scss">
span {
	color: transparent;
}
</style>
