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
	<ul class="debit">
		{#each debits as debit}
			<li>
				{debit}
			</li>
		{/each}
	</ul>
	<ul class="credit">
		{#each credits as credit}
			<li>
				{credit}
			</li>
		{/each}
	</ul>
</DataTableCell>

<style lang="scss">
	ul {
		list-style: none;
	}

	.debit {
		text-align: left;
		margin-right: 1em;
	}

	.credit {
		margin-left: 1em;
		text-align: right;
	}
</style>
