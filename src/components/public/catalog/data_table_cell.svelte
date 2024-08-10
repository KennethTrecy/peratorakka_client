<script lang="ts">
	import type { DataTableCellKind, DataTableCellStatus } from "+/component"

	export let kind: DataTableCellKind = "normal"
	export let status: DataTableCellStatus = "present"

	$: rowClasses = [
		"mdc-data-table__cell",
		kind === "numeric" ? "mdc-data-table__cell--numeric" : false,
		kind === "descriptive" ? "mdc-data-table__cell--descriptive" : false,
		kind === "representative" ? "mdc-data-table__cell--representative" : false,
		status === "archived" ? "mdc-data-table__cell--archived" : false
	].filter(Boolean).join(" ")
</script>

<td class={rowClasses}>
	<slot/>
</td>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;

	.mdc-data-table__cell--representative {
		max-width: 35ch;
		overflow: visible;
		text-overflow: initial;
		white-space: normal;
		text-align: justify;
	}

	.mdc-data-table__cell--descriptive {
		max-width: 70ch;
		overflow: visible;
		text-overflow: initial;
		white-space: normal;
		text-align: justify;
	}

	.mdc-data-table__cell--archived {
		text-decoration: line-through;
	}
</style>
