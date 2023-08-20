<script lang="ts">
	import type { DataTableCellKind, DataTableCellScope } from "+/component"

	export let kind: DataTableCellKind = "normal"
	export let scope: DataTableCellScope = "none"

	$: rowClasses = (
		scope === "none"
			? [
				"mdc-data-table__cell",
				kind === "numeric" ? "mdc-data-table__cell--numeric" : false
			]
			: [
				"mdc-data-table__header-cell",
				kind === "numeric" ? "mdc-data-table__header-cell--numeric" : false
			]
	).filter(Boolean).join(" ")
	$: resolvedScope = scope === "column" ? "col" : "row"
	$: role = scope === "column" ? "columnheader" : null
</script>

{#if kind === "normal"}
	<td class={rowClasses}>
		<slot/>
	</td>
{:else}
	<th
		class={rowClasses}
		{role}
		scope={resolvedScope}>
		<slot/>
	</th>
{/if}

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;
</style>
