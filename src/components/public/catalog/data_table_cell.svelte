<script lang="ts">
	import type { DataTableCellKind } from "+/component"

	export let kind: DataTableCellKind = "normal"

	$: rowClasses = [
		"mdc-data-table__cell",
		kind === "numeric" ? "mdc-data-table__cell--numeric" : false
	].filter(Boolean).join(" ")
</script>

<td class={rowClasses}>
	<slot/>
</td>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;
</style>
