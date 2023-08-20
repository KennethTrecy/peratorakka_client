<script lang="ts">
	import type { DataTableCellKind } from "+/component"

	export let kind: DataTableCellKind = "normal"

	$: headerClasses = [
		"mdc-data-table__header-cell",
		kind === "numeric" ? "mdc-data-table__header-cell--numeric" : false
	].filter(Boolean).join(" ")
</script>

<th
	class={headerClasses}
	role="columnheader"
	scope="col">
	<slot/>
</th>


<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;
</style>
