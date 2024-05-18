<script lang="ts">
	import type { Currency, CashFlowCategory, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup } from "+/rest"

	import CustomTrialRow from "%/frozen_periods/financial_statements/custom_trial_row.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let statement: FinancialStatementGroup
	export let currency: Currency|undefined
	export let cashFlowCategories: CashFlowCategory[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]


</script>

<QuarternaryHeading>Cash Flow Statement</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader scope="column">Category</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">


	</svelte:fragment>
</UnitDataTable>
