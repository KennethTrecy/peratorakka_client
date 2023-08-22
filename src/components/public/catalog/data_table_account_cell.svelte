<script lang="ts">
	import type { DataTableCellKind } from "+/component"

	import DataTableCell from "$/catalog/data_table_cell.svelte"

	export let kind: DataTableCellKind = "normal"
	export let rawDebit: any[]
	export let rawCredit: any[]

	$: debits = kind === "normal" ? (rawDebit as string[]) : (rawDebit as number[])
	$: credits = kind === "normal" ? (rawCredit as string[]) : (rawCredit as number[])
</script>

<DataTableCell {kind}>
	{#each debits as debit}
		<div class="debit">
			{debit}
		</div>
	{/each}
	{#each credits as credit}
		<div class="credit">
			{credit}
		</div>
	{/each}
</DataTableCell>

<style lang="scss">
	.debit {
		margin-right: 1em;
	}

	.credit {
		margin-left: 1em;
	}
</style>
