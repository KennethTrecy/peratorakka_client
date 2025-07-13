<script lang="ts">
import type { DataTableCellStatus } from "+/component"
import type {
	PrecisionFormat,
	Currency,
	CashFlowActivity,
	Account,
	Modifier,
	ModifierAtom,
	ModifierAtomActivity,
	FinancialEntry,
	FinancialEntryAtom,
	FinancialEntryAtomInput,
	CompleteFinancialEntryAtom,
	CompleteFinancialEntryAtomInput
} from "+/entity"

import { untrack } from "svelte"

import { UNKNOWN_OPTION, UNKNOWN_MODIFIER } from "#/component"
import { REAL_CREDIT_MODIFIER_ATOM_KIND, REAL_DEBIT_MODIFIER_ATOM_KIND } from "#/entity"

import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import formatAmount from "$/utility/format_amount"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "$/form/basic_form.svelte"
import BasicSkeletonForm from "%/financial_entries/basic_form.svelte"
import DataTableAccountCell from "$/catalog/data_table_account_cell.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRecord from "$/catalog/data_table_record.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextContainer from "$/typography/text_container.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

let {
	precisionFormats,
	currencies,
	accounts,
	cashFlowActivities,
	modifiers,
	modifierAtoms,
	modifierAtomActivities,
	data = $bindable(),
	subdata = $bindable(),
	remove
}: {
	precisionFormats: PrecisionFormat[]
	currencies: Currency[]
	cashFlowActivities: CashFlowActivity[]
	accounts: Account[]
	modifiers: Modifier[]
	modifierAtoms: ModifierAtom[]
	modifierAtomActivities: ModifierAtomActivity[]
	data: FinancialEntry
	subdata: FinancialEntryAtom[]
	remove: (entry: FinancialEntry) => void
} = $props()

let modifierID = $state(`${data.modifier_id}`)
let transactedAt = $state(data.transacted_at.slice(0, "YYYY-MM-DD".length))
let remarks = $state(data.remarks)
let atoms = $state<FinancialEntryAtomInput[]>([])

const forceDisabledFields: (keyof FinancialEntry)[] = [
	"modifier_id"
]

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_modifier_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let chosenModifier = $derived(modifiers.find(
	modifier => `${modifier.id}` === modifierID
) ?? UNKNOWN_MODIFIER)
let friendlyAction = $derived(convertSnakeCaseToProperCase(chosenModifier?.action ?? "unknown"))
let label = $derived(`${chosenModifier?.name ?? UNKNOWN_OPTION}${
	typeof chosenModifier === "undefined" ? "" : ` (${friendlyAction})`
}`)
let resolvedRemarks = $derived(remarks || "No remarks")
let headerStatus = $derived((isArchived ? "archived" : "present") as DataTableCellStatus)
let requiredModifierAtoms = $derived(modifierAtoms.filter(
	modifierAtom => modifierAtom.modifier_id === chosenModifier.id
))
let requiredModifierAtomIDs = $derived(requiredModifierAtoms.map(atom => atom.id))
let requiredModifierAtomActivities = $derived(modifierAtomActivities.filter(
	atomActivity => requiredModifierAtomIDs.indexOf(atomActivity.modifier_atom_id) > -1
))
let requiredAccountIDs = $derived(requiredModifierAtoms.map(atom => atom.account_id))
let requiredAccounts = $derived(accounts.filter(
	account => requiredAccountIDs.indexOf(account.id) > -1
))
let requiredCurrencyIDs = $derived(requiredAccounts.map(account => account.currency_id))
let requiredCurrencies = $derived(currencies.filter(
	currency => requiredCurrencyIDs.indexOf(currency.id) > -1
))
let associatedFinancialEntryAtoms = $derived(subdata.filter(
	atom => atom.financial_entry_id === data.id
))
$effect(() => {
	if (untrack(() => atoms).length !== associatedFinancialEntryAtoms.length) {
		untrack(() => {
			atoms = associatedFinancialEntryAtoms
		})
	}
})

let completeFinancialEntryAtoms = $derived(associatedFinancialEntryAtoms.reduce(
	(resolvedAtoms: CompleteFinancialEntryAtom[], financialEntryAtom: FinancialEntryAtom) => {
		const requiredModifierAtom = requiredModifierAtoms.find(
			modifierAtom => modifierAtom.id === financialEntryAtom.modifier_atom_id
		)

		if (typeof requiredModifierAtom === "undefined") return resolvedAtoms

		const requiredModifierAtomActivity = requiredModifierAtomActivities.find(
			atomActivity => atomActivity.modifier_atom_id === requiredModifierAtom.id
		) ?? null
		const requiredCashFlowActivity = cashFlowActivities.find(
			activity => activity.id === requiredModifierAtomActivity?.cash_flow_activity_id
		) ?? null

		const requiredAccount = requiredAccounts.find(
			account => account.id === requiredModifierAtom.account_id
		)

		if (typeof requiredAccount === "undefined") return resolvedAtoms

		const requiredCurrency = requiredCurrencies.find(
			currency => currency.id === requiredAccount.currency_id
		)

		if (typeof requiredCurrency === "undefined") return resolvedAtoms

		const requiredPrecisionFormat = precisionFormats.find(
			format => format.id === requiredCurrency.precision_format_id
		)

		if (typeof requiredPrecisionFormat === "undefined") return resolvedAtoms

		return [
			...resolvedAtoms,
			{
				"precision_format": requiredPrecisionFormat,
				"currency": requiredCurrency,
				"account": requiredAccount,
				"cash_flow_activity": requiredCashFlowActivity,
				"modifier_atom": requiredModifierAtom,
				"financial_entry_atom": financialEntryAtom
			}
		]
	},
	[]
))
let debitAtoms = $derived(completeFinancialEntryAtoms.filter(
	atom => atom.modifier_atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
))
let creditAtoms = $derived(completeFinancialEntryAtoms.filter(
	atom => atom.modifier_atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND
))
let debitExistence = $derived(debitAtoms.reduce(
	(resolvedNames: boolean[], atom: CompleteFinancialEntryAtom) => [
		...resolvedNames,
		atom.account.deleted_at === null,
		...(atom.cash_flow_activity ? [ atom.cash_flow_activity.deleted_at === null ] : [])
	],
	[]
))
let creditExistence = $derived(creditAtoms.reduce(
	(resolvedNames: boolean[], atom: CompleteFinancialEntryAtom) => [
		...resolvedNames,
		atom.account.deleted_at === null,
		...(atom.cash_flow_activity ? [ atom.cash_flow_activity.deleted_at === null ] : [])
	],
	[]
))
let debitNames = $derived(debitAtoms.reduce(
	(resolvedNames: string[], atom: CompleteFinancialEntryAtom) => [
		...resolvedNames,
		atom.account.name,
		...(atom.cash_flow_activity ? [ `(${atom.cash_flow_activity.name})` ] : [])
	],
	[]
))
let creditNames = $derived(creditAtoms.reduce(
	(resolvedNames: string[], atom: CompleteFinancialEntryAtom) => [
		...resolvedNames,
		atom.account.name,
		...(atom.cash_flow_activity ? [ `(${atom.cash_flow_activity.name})` ] : [])
	],
	[]
))
let debitAmounts = $derived(debitAtoms.reduce(
	(resolvedAmounts: string[], atom: CompleteFinancialEntryAtom) => [
		...resolvedAmounts,
		formatAmount(
			atom.precision_format,
			atom.currency,
			atom.financial_entry_atom.numerical_value
		),
		...(atom.cash_flow_activity ? [ "" ] : [])
	],
	[]
))
let creditAmounts = $derived(creditAtoms.reduce(
	(resolvedAmounts: string[], atom: CompleteFinancialEntryAtom) => [
		...resolvedAmounts,
		formatAmount(
			atom.precision_format,
			atom.currency,
			atom.financial_entry_atom.numerical_value
		),
		...(atom.cash_flow_activity ? [ "" ] : [])
	],
	[]
))

let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/financial_entries/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				"modifier_id": parseInt(modifierID),
				"transacted_at": `${transactedAt} 00:00:00`,
				remarks
			}

			subdata = subdata.map(atom => {
				if (atom.financial_entry_id === data.id) {
					return {
						...atom,
						"numerical_value": atoms.find(
							completeAtom => completeAtom.id === atom.id
						)?.numerical_value ?? atom.numerical_value
					}
				}

				return atom
			})
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"financial_entry": {
				"modifier_id": parseInt(modifierID),
				"transacted_at": `${transactedAt} 00:00:00`,
				remarks,
				"@relationship": {
					"financial_entry_atoms": atoms
				}
			}
		})
	}
))

function resetDraft() {
	modifierID = `${data.modifier_id}`
	transactedAt = data.transacted_at.slice(0, "YYYY-MM-DD".length)
	remarks = data.remarks
	atoms = associatedFinancialEntryAtoms
}

let isConnectingToUpdate = $derived(restorableItemOptions.isConnectingToUpdate)
let updateErrors = $derived(restorableItemOptions.updateErrors)
</script>

<BasicSkeletonForm
	{currencies}
	{accounts}
	{modifiers}
	{modifierAtoms}
	bind:modifierID={modifierID}
	bind:transactedAt={transactedAt}
	bind:atoms={atoms}
	bind:remarks={remarks}
	{forceDisabledFields}
	isConnecting={$isConnectingToUpdate}
	{IDPrefix}
	errors={$updateErrors}>
	{#snippet form({ atomsField, remarksField, modifierField, transactedAtField })}
		<DataTableRecord
			{label}
			{isArchived}
			options={restorableItemOptions}
			{resetDraft}>
			{#snippet delete_confirmation_message()}
				<ShortParagraph>
					Deleting this financial entry may cause inaccuracy of the cash flow statements.
				</ShortParagraph>
			{/snippet}
			{#snippet restore_confirmation_message()}
				<ShortParagraph>
					Restoring this financial entry may cause inaccuracy of the cash flow statements.
				</ShortParagraph>
			{/snippet}
			{#snippet force_delete_confirmation_message()}
				<ShortParagraph>
					Deleting this financial entry may cause inaccuracy of the cash flow statements permanently.
				</ShortParagraph>
			{/snippet}
			{#snippet normal_cells({ isEditing })}
				<DataTableHeader scope="row" status={headerStatus}>
					{#if isEditing}
						{@render transactedAtField()}
					{:else}
						{transactedAt}
					{/if}
				</DataTableHeader>
				{#if isEditing}
					<DataTableCell columnSpan={2}>
						{@render atomsField()}
					</DataTableCell>
				{:else}
					<DataTableAccountCell
						kind="normal"
						rawDebitExistence={debitExistence}
						rawDebit={debitNames}
						rawCreditExistence={creditExistence}
						rawCredit={creditNames}/>
					<DataTableAccountCell
						kind="numeric"
						rawDebitExistence={debitExistence}
						rawDebit={debitAmounts}
						rawCreditExistence={creditExistence}
						rawCredit={creditAmounts}/>
				{/if}
			{/snippet}
			{#snippet other_info()}
				<Flex mustPad={false} justifyContent="start" direction="row">
					<WeakenedTertiaryHeading>
						{chosenModifier.name} ({convertSnakeCaseToProperCase(chosenModifier.action)})
					</WeakenedTertiaryHeading>
					<ElementalParagraph>{resolvedRemarks}</ElementalParagraph>
				</Flex>
			{/snippet}
			{#snippet mini_edit_form({ isConnecting, errors, confirmEdit, cancelEdit })}
				<BasicForm id={formID} {isConnecting} {errors} onsubmit={confirmEdit}>
					{#snippet fields()}
						{@render remarksField()}
					{/snippet}
					{#snippet button_group()}
						<EditActionCardButtonPair
							disabled={isConnecting}
							{cancelEdit}/>
					{/snippet}
				</BasicForm>
			{/snippet}
		</DataTableRecord>
	{/snippet}
</BasicSkeletonForm>
