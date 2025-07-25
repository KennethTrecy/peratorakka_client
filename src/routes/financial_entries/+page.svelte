<script lang="ts">
import type { ContextBundle } from "+/component"
import type {
	PrecisionFormat,
	Currency,
	Account,
	CashFlowActivity,
	Modifier,
	ModifierAtom,
	ModifierAtomActivity,
	FinancialEntry,
	FinancialEntryAtom,
	FinancialEntryAtomInput
} from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { DESCENDING_ORDER } from "#/rest"
import { GLOBAL_CONTEXT } from "#/contexts"
import { ANY_ACCOUNT, ANY_MODIFIER, UNKNOWN_OPTION } from "#/component"

import assertAuthentication from "$/page_requirement/assert_authentication"
import makeDateFieldValue from "$/utility/make_date_field_value"
import mergeUniqueResources from "$/utility/merge_unique_resources"

import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRecordHeader from "$/catalog/data_table_record_headers.svelte"
import FinancialEntryRecord from "%/financial_entries/financial_entry_record.svelte"
import CardForm from "%/financial_entries/card_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ListSpecifier from "%/financial_entries/list_specifier.svelte"
import TextContainer from "$/typography/text_container.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let precisionFormats = $state<PrecisionFormat[]>([])
let currencies = $state<Currency[]>([])
let accounts = $state<Account[]>([])
let cashFlowActivities = $state<CashFlowActivity[]>([])
let modifiers = $state<Modifier[]>([])
let modifierAtoms = $state<ModifierAtom[]>([])
let modifierAtomActivities = $state<ModifierAtomActivity[]>([])
let financialEntryAtoms = $state<FinancialEntryAtom[]>([])

function deriveID(resource: unknown): string {
	return `${(resource as FinancialEntry).id}`
}

const currentTransactedDate = makeDateFieldValue(new Date())
const lastDate =  new Date()
lastDate.setFullYear(lastDate.getFullYear() - 1)
const lastTransactedDate = makeDateFieldValue(lastDate)

let beginDate = $state(lastTransactedDate)
let endDate = $state(currentTransactedDate)
let selectedAccountID = $state(`${ANY_ACCOUNT.id}`)
let selectedModifierID = $state(`${ANY_MODIFIER.id}`)

let modifierID = $state(UNKNOWN_OPTION)
let transactedAt = $state(currentTransactedDate)
let remarks = $state("")
let atoms = $state<FinancialEntryAtomInput[]>([])

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"financial_entry": {
			"modifier_id": parseInt(modifierID),
			"transacted_at": `${transactedAt} 00:00:00`,
			remarks,
			"@relationship": {
				"financial_entry_atoms": atoms
			}
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	remarks = ""
	atoms = []

	const {
		financial_entry,
		"financial_entry_atoms": newFinancialEntryAtoms
	} = document

	financialEntryAtoms = mergeUniqueResources(
		financialEntryAtoms,
		newFinancialEntryAtoms as FinancialEntryAtom[]
	)
	return financial_entry
}

function processListResourceObject(document: Record<string, unknown>): void {
	financialEntryAtoms = mergeUniqueResources(
		financialEntryAtoms,
		document["financial_entry_atoms"] as FinancialEntryAtom[]
	)
}

let existingCurrencies = $derived(currencies.filter(
	currency => currency.deleted_at === null
))
let existingAccounts = $derived(accounts.filter(
	account => account.deleted_at === null
))
let existingCashFlowActivities = $derived(cashFlowActivities.filter(
	cashFlowActivity => cashFlowActivity.deleted_at === null
))
</script>

<CompleteResourcePage
	pageTitle="General Ledger"
	createTitle="Add Financial Entry"
	listTitle="Available Financial Entries"
	collectiveName="financial_entries"
	defaultSortCriterion="transacted_at"
	defaultSortOrder={DESCENDING_ORDER}
	availableSortCriteria={[
		"transacted_at",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	additionalListParameters={[
		[ "filter[begin_date]", beginDate as string ],
		[ "filter[end_date]", endDate as string ],
		...(selectedAccountID !== `${ANY_ACCOUNT.id}` ? [
			[ "filter[account_id]", selectedAccountID as string ]
		] : []) as [ string, string ][],
		...(selectedModifierID !== `${ANY_MODIFIER.id}` ? [
			[ "filter[modifier_id]", selectedModifierID as string ]
		]: []) as [ string, string ][],
		[ "relationship", "financial_entry_atoms" ]
	]}
	dependencies={[ existingCurrencies, existingAccounts, existingCashFlowActivities ]}
	dependencyInfos={[
		{
			"partialPath": "/api/v2/cash_flow_activities",
			"mainSortCriterion": "name",
			"resourceKey": "cash_flow_activities",
			"getResources": () => cashFlowActivities,
			"setResources": newResources => { cashFlowActivities = newResources as CashFlowActivity[] }
		},
		{
			"partialPath": "/api/v2/accounts",
			"mainSortCriterion": "name",
			"resourceKey": "accounts",
			"getResources": () => accounts,
			"setResources": newResources => { accounts = newResources as Account[] }
		},
		{
			"partialPath": "/api/v2/currencies",
			"mainSortCriterion": "name",
			"resourceKey": "currencies",
			"getResources": () => currencies,
			"setResources": newResources => { currencies = newResources as Currency[] }
		},
		{
			"partialPath": "/api/v2/precision_formats",
			"mainSortCriterion": "name",
			"resourceKey": "precision_formats",
			"getResources": () => precisionFormats,
			"setResources": newResources => { precisionFormats = newResources as PrecisionFormat[] }
		},
		{
			"partialPath": "/api/v2/modifiers",
			"mainSortCriterion": "name",
			"resourceKey": "modifiers",
			"additionalPathParameters": [
				[ "relationship", "modifier_atoms,modifier_atom_activities" ]
			],
			"getResources": () => modifiers,
			"setResources": newResources => { modifiers = newResources as Modifier[] },
			"getLinkedResources": () => [
				{
					"resourceKey": "modifier_atoms",
					"resources": modifierAtoms
				},
				{
					"resourceKey": "modifier_atom_activities",
					"resources": modifierAtomActivities,
					"keyGenerator": element => `${
						(element as ModifierAtomActivity).modifier_atom_id
					}_${
						(element as ModifierAtomActivity).cash_flow_activity_id
					}`
				}
			],
			"setLinkedResources": newResources => {
				modifierAtoms = newResources[0] as unknown as ModifierAtom[]
				modifierAtomActivities = newResources[1] as unknown as ModifierAtomActivity[]
			}
		}
	]}
	{deriveID}
	{makeNewResourceObject}
	{processCreatedResourceObject}
	{processListResourceObject}>
	{#snippet general_description()}
		<TextContainer>
			<ElementalParagraph>
				Financial entries are the main data that is being processed by the system. They always have a pair of debit amount and credit amount.
			</ElementalParagraph>
			<ElementalParagraph>
				Financial entries may be created manually. In the future, automatic creation of entries may be available in the system.
			</ElementalParagraph>
			<ElementalParagraph>
				To create an entry manually, choose a manual modifier that would be associated with the entry. The transaction date may be earlier than the current date to track previous entries. Submit the entry after entering the debit and credit amounts and optional remarks.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<CardForm
			currencies={existingCurrencies}
			accounts={existingAccounts}
			modifiers={modifiers}
			modifierAtoms={modifierAtoms}
			bind:modifierID={modifierID}
			bind:transactedAt={transactedAt}
			bind:atoms={atoms}
			bind:remarks={remarks}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least one manual modifier must exist in the profile to show the form for creating
			financial entries.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the financial entries that you have added on to your profile.
		Entries should be frozen to prevent editing or deletion.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available financial entries at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if} a
		financial entry to view.
	{/snippet}
	{#snippet custom_list_specifiers({ isConnecting, errors })}
		<ListSpecifier
			{currencies}
			{accounts}
			{modifiers}
			{modifierAtoms}
			bind:beginDate={beginDate}
			bind:endDate={endDate}
			bind:selectedAccountID={selectedAccountID}
			bind:selectedModifierID={selectedModifierID}
			{isConnecting}
			listErrors={errors}/>
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		<GridCell kind="full">
			<Flex direction="column" mustPad={false}>
				<UnitDataTable>
					{#snippet table_headers()}
						<DataTableRecordHeader
							mainCellLabel="Transacted Date"
							actionCellLabel="Modifier Name, Remarks, and Available Actions">
							{#snippet trailing_headers()}
								<DataTableHeader scope="column">Involved Accounts</DataTableHeader>
								<DataTableHeader scope="column" kind="descriptive">
									Debited/Credited<br/>Amounts
								</DataTableHeader>
							{/snippet}
						</DataTableRecordHeader>
					{/snippet}
					{#snippet table_rows()}
						{#each resources as entity, index((entity as FinancialEntry).id)}
							<FinancialEntryRecord
								{precisionFormats}
								{currencies}
								{cashFlowActivities}
								{accounts}
								{modifiers}
								{modifierAtoms}
								{modifierAtomActivities}
								bind:data={
									() => entity as FinancialEntry,
									updatedResource => updateResource(updatedResource, index)
								}
								bind:subdata={financialEntryAtoms}
								remove={removeResource}/>
						{/each}
					{/snippet}
				</UnitDataTable>
			</Flex>
		</GridCell>
	{/snippet}
</CompleteResourcePage>
