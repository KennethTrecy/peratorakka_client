<script lang="ts">
import type { SimplifiedSummaryCalculation } from "+/component"

import CustomTrialRow from "%/frozen_periods/financial_statements/custom_trial_row.svelte"

let { data }: {
	data: SimplifiedSummaryCalculation
} = $props()
</script>

<CustomTrialRow
	rowName={data.account.name}
	shownDebitAmount={data.debitAmount}
	shownCreditAmount={data.creditAmount}/>
