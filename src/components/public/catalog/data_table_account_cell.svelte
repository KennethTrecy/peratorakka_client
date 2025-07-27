<script lang="ts">
import type { DataTableCellKind } from "+/component"

import AmountDisplay from "$/utility/amount_display.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"

let {
	kind = "normal",
	rawDebitExistence,
	rawDebit,
	rawCreditExistence,
	rawCredit
}: {
	kind?: DataTableCellKind
	rawDebitExistence: boolean[]
	rawDebit: string[]
	rawCreditExistence: boolean[]
	rawCredit: string[]
} = $props()

let debitClasses = $derived([
	"browser-default",
	"debit",
	"p-0",
	kind
].join(" "))
let creditClasses = $derived([
	"browser-default",
	"credit",
	"p-0",
	kind
].join(" "))
</script>

<DataTableCell {kind}>
	<ul class={debitClasses}>
		{#each rawDebit as debit, i}
			<li data-exists={rawDebitExistence[i]}>
				{#if rawDebit.length > 2}
					<AmountDisplay shownAmount={debit}/>
				{:else if kind === "numeric"}
					{debit.replace(".-", "").replaceAll("-", "")}
				{:else}
					{debit}
				{/if}
			</li>
		{/each}
	</ul>
	<ul class={creditClasses}>
		{#each rawCredit as credit, i}
			<li data-exists={rawCreditExistence[i]}>
				{#if rawCredit.length > 2}
					<AmountDisplay shownAmount={credit}/>
				{:else if kind === "numeric"}
					{credit.replace(".-", "").replaceAll("-", "")}
				{:else}
					{credit}
				{/if}
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
