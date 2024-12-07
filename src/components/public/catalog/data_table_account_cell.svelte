<script lang="ts">
import type { DataTableCellKind } from "+/component"

import DataTableCell from "$/catalog/data_table_cell.svelte"

export let kind: DataTableCellKind = "normal"
export let rawDebitExistence: boolean[]
export let rawDebit: any[]
export let rawCreditExistence: boolean[]
export let rawCredit: any[]

$: debits = kind === "normal" ? (rawDebit as string[]) : (rawDebit as number[])
$: credits = kind === "normal" ? (rawCredit as string[]) : (rawCredit as number[])
$: debitClasses = [
	"browser-default",
	"debit",
	"p-0",
	kind
].join(" ")
$: creditClasses = [
	"browser-default",
	"credit",
	"p-0",
	kind
].join(" ")
</script>

<DataTableCell {kind}>
	<ul class={debitClasses}>
		{#each debits as debit, i}
			<li data-exists={rawDebitExistence[i]}>
				{debit}
			</li>
		{/each}
	</ul>
	<ul class={creditClasses}>
		{#each credits as credit, i}
			<li data-exists={rawCreditExistence[i]}>
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

	li[data-exists=false] {
		text-decoration: line-through;
	}
}

.credit {
	text-align: right;

	li[data-exists=false] {
		text-decoration: line-through;
	}
}

.debit.normal, .debit.numeric {
	margin-right: 1em;
}

.credit.normal, .credit.numeric {
	margin-left: 1em;
}

.numeric {
	overflow: clip;
	text-overflow: clip;
	white-space: nowrap;
}
</style>
