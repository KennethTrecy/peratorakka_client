<script lang="ts">
import type { FrozenPeriod } from "+/entity"
import type { ContextBundle } from "+/component"
import type { CompleteFrozenPeriodInfo } from "+/rest"

import { writable } from "svelte/store"
import { getContext, untrack } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { DESCENDING_ORDER } from "#/rest"

import makeDateFieldValue from "$/utility/make_date_field_value"
import assertAuthentication from "$/page_requirement/assert_authentication"
import makeJSONRequester from "$/rest/make_json_requester"

import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRecordHeader from "$/catalog/data_table_record_headers.svelte"
import FrozenPeriodRecord from "%/frozen_periods/frozen_period_record.svelte"
import BasicForm from "%/frozen_periods/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import TextContainer from "$/typography/text_container.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"
import FinancialStatements from "%/frozen_periods/financial_statements.svelte"
import TextCardButton from "$/button/card/text.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

function deriveID(resource: unknown): string {
	return `${(resource as FrozenPeriod).id}`
}

const previousDate =  new Date()
previousDate.setDate(1)
const defaultStartedDate = makeDateFieldValue(previousDate)
const defaultFinishedDate = makeDateFieldValue(new Date())

let startedAt: string = $state(defaultStartedDate)
let finishedAt: string = $state(defaultFinishedDate)

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"frozen_period": {
			"started_at": `${startedAt} 00:00:00`,
			"finished_at": `${finishedAt} 11:59:59`
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	const nextStartedAt = new Date(startedAt)
	nextStartedAt.setMonth(nextStartedAt.getMonth() + 1)
	const nextFinishedAt = new Date(finishedAt)
	nextFinishedAt.setDate(1)
	nextFinishedAt.setMonth(nextFinishedAt.getMonth() + 2)
	nextFinishedAt.setTime(nextFinishedAt.getTime() - 24 * 60 * 60 * 1000)

	startedAt = makeDateFieldValue(nextStartedAt)
	finishedAt = makeDateFieldValue(nextFinishedAt)

	const { frozen_period } = document

	return frozen_period
}

let hasAttemptedDryRun = $state(false)
let dryRunCompleteFrozenPeriodInfo = $state<CompleteFrozenPeriodInfo|null>(null)

let {
	"isConnecting": isConnectingToDryRunCreate,
	"errors": dryRunCreateErrors,
	"send": requestToDryRunCreate
} = makeJSONRequester({
	"path": "/api/v2/frozen_periods/dry_run",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 200,
			"action": async (response: Response) => {
				const document = await response.json()

				dryRunCompleteFrozenPeriodInfo = document
				dryRunCreateErrors.set([])
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function dryRunCreateFrozenPeriod(
	display: (completeFrozenPeriodInfo: CompleteFrozenPeriodInfo) => void
) {
	hasAttemptedDryRun = false

	await requestToDryRunCreate({
		"body": JSON.stringify({
			"frozen_period": {
				"started_at": `${startedAt} 00:00:00`,
				"finished_at": `${finishedAt} 11:59:59`
			}
		})
	})

	if (dryRunCompleteFrozenPeriodInfo) {
		display(dryRunCompleteFrozenPeriodInfo)

		hasAttemptedDryRun = true
	}
}

let completeFrozenPeriodInfo = $state<CompleteFrozenPeriodInfo|null>(null)
const partialPath = "/api/v2/frozen_periods"
let completePath = writable(partialPath)
const { isConnecting, errors, send } = makeJSONRequester({
	"path": completePath,
	"defaultRequestConfiguration": {
		"method": "GET",
	},
	"manualResponseHandlers": [
		{
			"statusCode": 200,
			"action": async (response: Response) => {
				const responseDocument = await response.json()
				completeFrozenPeriodInfo = responseDocument
				errors.set([])
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function checkFrozenPeriod(
	selectedFrozenPeriod: FrozenPeriod,
	display: (completeFrozenPeriodInfo: CompleteFrozenPeriodInfo) => void
) {
	completePath.set(`${partialPath}/${selectedFrozenPeriod.id}?relationship=*`)
	await send({})

	if (completeFrozenPeriodInfo !== null) {
		display(completeFrozenPeriodInfo)
	}
}
</script>

<svelte:head>
	<title>Frozen Periods</title>
</svelte:head>

<FinancialStatements isConnecting={$isConnecting} errors={$errors}>
	{#snippet children({
		"financialStatementCluster": checkFinancialStatementCluster,
		"display": checkDisplay
	})}
		<FinancialStatements isConnecting={$isConnectingToDryRunCreate} errors={$dryRunCreateErrors}>
			{#snippet children({
				"financialStatementCluster": dryRunFinancialStatementCluster,
				"display": dryRunDisplay
			})}
				<CompleteResourcePage
					pageTitle="Frozen Periods"
					createTitle="Add Frozen Periods"
					listTitle="Frozen Periods"
					collectiveName="frozen_periods"
					defaultSortCriterion="started_at"
					defaultSortOrder={DESCENDING_ORDER}
					availableSortCriteria={[
						"started_at",
						"finished_at"
					]}
					{deriveID}
					{makeNewResourceObject}
					{processCreatedResourceObject}>
					{#snippet general_description()}
						<TextContainer>
							<ElementalParagraph>
								Frozen periods prevents editing, removal, or addition of financial entries
								at a certain point of time. They contain summary of calculations of each
								account which would be used on the consecutive frozen period.
							</ElementalParagraph>
							<ElementalParagraph>
								To create frozen period, choose the started date and finished date of a
								frozen period. It recommended to freeze every month for correct analysis and
								better performance. Check the balances of each account and ensure the
								temporary accounts have been closed. If every calculation is in order,
								freeze the period and the system would wait for future entries.
							</ElementalParagraph>
						</TextContainer>
					{/snippet}
					{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
						{#snippet customized_button_group()}
							<TextCardButton
								kind="button"
								disabled={$isConnectingToDryRunCreate}
								label="Check"
								onclick={() => dryRunCreateFrozenPeriod(dryRunDisplay)}/>
							{@render button_group()}
						{/snippet}
						<BasicForm
							bind:startedAt={startedAt}
							bind:finishedAt={finishedAt}
							{isConnecting}
							{IDPrefix}
							{errors}
							{onsubmit}
							button_group={customized_button_group}/>
					{/snippet}
					{#snippet requirement()}
						<ElementalParagraph>
							At least one manual modifier must exist in the profile to show the form for
							creating financial entries.
						</ElementalParagraph>
					{/snippet}
					{#snippet create_grid_cell_rear()}
						{#if hasAttemptedDryRun || $isConnectingToDryRunCreate}
							{@render dryRunFinancialStatementCluster()}
						{/if}
					{/snippet}
					{#snippet filled_collection_description()}
						Below are the frozen periods that you have added on to your profile.
						Freezing certain periods is a feature to optimize the calculation of
						different accounts. It also serves as an artifact when reviewing the
						past financial statements.
					{/snippet}
					{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
						There are no available frozen periods at the moment.
						{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived
						}Delete{/if}a frozen period to view.
					{/snippet}
					{#snippet collection_items({ resources, removeResource })}
						<GridCell kind="full">
							<Flex direction="column" mustPad={false}>
								<UnitDataTable>
									{#snippet table_headers()}
										<DataTableRecordHeader
											mainCellLabel="ID"
											actionCellLabel="Available Actions">
											{#snippet trailing_headers()}
												<DataTableHeader>Start Date</DataTableHeader>
												<DataTableHeader>Finish Date</DataTableHeader>
											{/snippet}
										</DataTableRecordHeader>
									{/snippet}
									{#snippet table_rows()}
										{#each resources as entity((entity as FrozenPeriod).id)}
											<FrozenPeriodRecord
												data={entity as FrozenPeriod}
												remove={removeResource}
												check={() => checkFrozenPeriod(
													entity as FrozenPeriod,
													checkDisplay
												)}/>
										{/each}
									{/snippet}
								</UnitDataTable>
							</Flex>
						</GridCell>
					{/snippet}
					{#snippet list_grid_cell_rear()}
						{@render checkFinancialStatementCluster()}
					{/snippet}
				</CompleteResourcePage>
			{/snippet}
		</FinancialStatements>
	{/snippet}
</FinancialStatements>
