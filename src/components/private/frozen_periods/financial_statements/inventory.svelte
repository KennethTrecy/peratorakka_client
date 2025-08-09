<script lang="ts">
import type { SimplifiedItemCalculation } from "+/component"

import DataTableRow from "$/catalog/data_table_row.svelte"
import AmountDisplay from "$/utility/amount_display.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

let {
	data
}: {
	data: SimplifiedItemCalculation[]
} = $props()

</script>

<QuarternaryHeading>Inventory</QuarternaryHeading>
<UnitDataTable>
	{#snippet table_headers()}
		<DataTableHeader scope="column">Account</DataTableHeader>
		<DataTableHeader scope="column">Quantity</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Total Cost</DataTableHeader>
	{/snippet}
	{#snippet table_rows()}
		{#each data as calculation(calculation.account.id)}
			<DataTableRow>
				<DataTableHeader scope="row">{calculation.account.name}</DataTableHeader>
				<DataTableCell kind="numeric">
					<AmountDisplay shownAmount={calculation.totalRemainingQuantity}/>
				</DataTableCell>
				<DataTableCell kind="numeric">
					<AmountDisplay shownAmount={calculation.totalRemainingCost}/>
				</DataTableCell>
			</DataTableRow>
		{/each}
	{/snippet}
</UnitDataTable>
