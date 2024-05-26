<script lang="ts">
	import type { FinancialStatementGroup } from "+/rest"
	import type {
		Currency,
		CashFlowActivity,
		Account,
		FrozenPeriod,
		SummaryCalculation,
		FlowCalculation
	} from "+/entity"

	import { createEventDispatcher } from "svelte"

	import makeDateFieldValue from "$/utility/make_date_field_value"
	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/frozen_periods/basic_form.svelte"
	import FinancialStatements from "%/frozen_periods/financial_statements.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	const dispatch = createEventDispatcher<{
		"create": FrozenPeriod
	}>()
	const IDPrefix = "new_"

	const previousDate =  new Date()
	previousDate.setDate(1)
	const defaultStartedDate = makeDateFieldValue(previousDate)
	const defaultFinishedDate = makeDateFieldValue(new Date())

	export let isLoadingInitialData: boolean

	let hasAttemptedDryRun = false
	let statements: FinancialStatementGroup[] = []
	let summaryCalculations: SummaryCalculation[] = []
	let flowCalculations: FlowCalculation[] = []
	let currencies: Currency[] = []
	let cashFlowActivities: CashFlowActivity[] = []
	let accounts: Account[] = []

	let startedAt: string = defaultStartedDate
	let finishedAt: string = defaultFinishedDate

	let {
		"isConnecting": isConnectingToCreate,
		"errors": createErrors,
		"send": requestToCreate
	} = makeJSONRequester({
		"path": "/api/v1/frozen_periods",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
				"action": async (response: Response) => {
					const document = await response.json()
					const { "frozen_period": frozenPeriod } = document

					startedAt = defaultStartedDate
					finishedAt = defaultFinishedDate
					createErrors.set([])
					dispatch("create", frozenPeriod)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createFrozenPeriod() {
		await requestToCreate({
			"body": JSON.stringify({
				"frozen_period": {
					"started_at": `${startedAt} 00:00:00`,
					"finished_at": `${finishedAt} 11:59:59`
				}
			})
		})
	}

	let {
		"isConnecting": isConnectingToDryRunCreate,
		"errors": dryRunCreateErrors,
		"send": requestToDryRunCreate
	} = makeJSONRequester({
		"path": "/api/v1/frozen_periods/dry_run",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					const document = await response.json()
					summaryCalculations = document.summary_calculations
					flowCalculations = document.flow_calculations
					accounts = document.accounts
					currencies = document.currencies
					cashFlowActivities = document.cash_flow_activities
					statements = document["@meta"].statements

					dryRunCreateErrors.set([])
					hasAttemptedDryRun = true
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function dryRunCreateFrozenPeriod() {
		await requestToDryRunCreate({
			"body": JSON.stringify({
				"frozen_period": {
					"started_at": `${startedAt} 00:00:00`,
					"finished_at": `${finishedAt} 11:59:59`
				}
			})
		})
	}
</script>

<DescriptiveForm
	individualName="Frozen Period"
	mayShowForm={true}
	{isLoadingInitialData}>
	<TextContainer slot="description">
		<ElementalParagraph>
			Frozen periods prevents editing, removal, or addition of financial entries at a certain point of time. They contain summary of calculations of each account which would be used on the consecutive frozen period.
		</ElementalParagraph>
		<ElementalParagraph>
			To create frozen period, choose the started date and finished date of a frozen period. Check the balances of each account and ensure the temporary accounts have been closed. If every calculation is in order, freeze the period and the system would wait for future entries.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		bind:startedAt={startedAt}
		bind:finishedAt={finishedAt}
		isConnecting={$isConnectingToCreate}
		{IDPrefix}
		errors={$createErrors}
		on:submit={createFrozenPeriod}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="button"
				disabled={$isConnectingToCreate}
				label="Check"
				on:click={dryRunCreateFrozenPeriod}/>
			<TextCardButton
				kind="submit"
				disabled={$isConnectingToCreate}
				label="Submit"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
{#if hasAttemptedDryRun}
	<FinancialStatements
		isConnecting={$isConnectingToDryRunCreate}
		startedAt={startedAt}
		finishedAt={finishedAt}
		{statements}
		{accounts}
		{currencies}
		{cashFlowActivities}
		{summaryCalculations}
		{flowCalculations}>
		<svelte:fragment slot="empty_collection_description">
			There are no financial statements at the chosen date range. Please check another range.
		</svelte:fragment>
	</FinancialStatements>
{/if}
