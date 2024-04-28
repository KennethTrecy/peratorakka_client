<script lang="ts">
	import type { DataTableCellKind, DataTableCellScope } from "+/component"

	export let kind: DataTableCellKind = "normal"
	export let scope: DataTableCellScope = "row"

	$: headerClasses = [
		"mdc-data-table__header-cell",
		kind === "numeric" ? "mdc-data-table__header-cell--numeric" : false,
		kind === "descriptive" ? "mdc-data-table__header-cell--descriptive" : false
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
	@use "@/components/third-party/index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;

	.mdc-data-table__header-cell--descriptive {
		max-width: 70ch;
		overflow: visible;
		text-overflow: initial;
		white-space: normal;
		text-align: left;
	}
</style>
