<script lang="ts">
	import type { DataTableCellKind, DataTableCellScope } from "+/component"

	export let kind: DataTableCellKind = "normal"
	export let scope: DataTableCellScope = "row"

	$: headerClasses = [
		"mdc-data-table__header-cell",
		kind === "numeric" ? "mdc-data-table__header-cell--numeric" : false
	].filter(Boolean).join(" ")
	$: resolvedScope = scope === "column" ? "col" : "row"
	$: role = scope === "column" ? "columnheader" : null
</script>

<th
	class={headerClasses}
	{role}
	scope={resolvedScope}>
	<slot/>
</th>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;
</style>
