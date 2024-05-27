<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type {
		Currency,
		CashFlowActivity,
		Account,
		AcceptableModifierKind,
		AcceptableModifierAction,
		Modifier
	} from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import { acceptableModifierKinds, acceptableModifierActions } from "#/entity"
	import { UNKNOWN_ACCOUNT } from "#/component"
	import { NO_CASH_FLOW_ACTIVITY } from "#/component"

	import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/modifiers/basic_form.svelte"
	import CollectionItem from "$/catalog/collection_item.svelte"
	import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
	import Flex from "$/layout/flex.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"

	export let currencies: Currency[]
	export let cashFlowActivities: CashFlowActivity[]
	export let accounts: Account[]
	export let data: Modifier

	const dispatch = createEventDispatcher<{
		"delete": Modifier
	}>()
	let debitAccountID = `${data.debit_account_id}`
	let creditAccountID = `${data.credit_account_id}`
	let debitCashFlowActivityID = data.debit_cash_flow_activity_id === null
		? `${NO_CASH_FLOW_ACTIVITY.id}`
		: `${data.debit_cash_flow_activity_id}`
	let creditCashFlowActivityID = data.credit_cash_flow_activity_id === null
		? `${NO_CASH_FLOW_ACTIVITY.id}`
		: `${data.credit_cash_flow_activity_id}`
	let name = data.name
	let description = data.description
	let kind = fallbackToAceptableKind(data.kind)
	let action = fallbackToAceptableAction(data.action)
	const forceDisabledFields: (keyof Modifier)[] = [
		"debit_account_id",
		"credit_account_id",
		"kind",
		"action"
	]

	$: IDPrefix = `old_modifier_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	$: debitAccount = accounts.find(
		account => account.id === data.debit_account_id
	) ?? UNKNOWN_ACCOUNT
	$: creditAccount = accounts.find(
		account => account.id === data.credit_account_id
	) ?? UNKNOWN_ACCOUNT
	$: friendlyAction = data.action
	$: friendlyKind = data.kind
	$: resolvedDescription = description || "None"
	$: hasDebitCashFlowActivity = debitCashFlowActivityID !== `${NO_CASH_FLOW_ACTIVITY.id}`
	$: associatedDebitCashFlowActivity = hasDebitCashFlowActivity ? cashFlowActivities.find(
		cashFlowActivity => cashFlowActivity.id === parseInt(debitCashFlowActivityID)
	) as CashFlowActivity : null
	$: hasCreditCashFlowActivity = creditCashFlowActivityID !== `${NO_CASH_FLOW_ACTIVITY.id}`
	$: associatedCreditCashFlowActivity = hasCreditCashFlowActivity ? cashFlowActivities.find(
		cashFlowActivity => cashFlowActivity.id === parseInt(creditCashFlowActivityID)
	) as CashFlowActivity : null

	$: friendlyDebitActivityName = hasDebitCashFlowActivity
		? associatedDebitCashFlowActivity?.name
		: null
	$: friendlyCreditActivityName = hasCreditCashFlowActivity
		? associatedCreditCashFlowActivity?.name
		: null

	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = () => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = () => Promise.resolve()

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/modifiers/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "PUT",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						data = {
							...data,
							// TODO: Renewal of cash flow activity is temporary. To be removed next update.
							"debit_cash_flow_activity_id":
								debitCashFlowActivityID === `${NO_CASH_FLOW_ACTIVITY.id}`
									? null
									: parseInt(debitCashFlowActivityID),
							"credit_cash_flow_activity_id":
								creditCashFlowActivityID === `${NO_CASH_FLOW_ACTIVITY.id}`
									? null
									: parseInt(creditCashFlowActivityID),
							name,
							description
						}
						updateErrors.set([])
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToUpdate = requesterInfo.isConnecting
		updateErrors = requesterInfo.errors
		requestUpdate = async () => {
			await requesterInfo.send({
				"body": JSON.stringify({
					"modifier": {
						// TODO: Renewal of cash flow activity is temporary. To be removed next update.
						"debit_cash_flow_activity_id":
							debitCashFlowActivityID === `${NO_CASH_FLOW_ACTIVITY.id}`
								? null
								: parseInt(debitCashFlowActivityID),
						"credit_cash_flow_activity_id":
							creditCashFlowActivityID === `${NO_CASH_FLOW_ACTIVITY.id}`
								? null
								: parseInt(creditCashFlowActivityID),
						name,
						description
					}
				})
			})
		}
	}
	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/modifiers/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "DELETE",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						dispatch("delete", data)
						deleteErrors.set([])
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToDelete = requesterInfo.isConnecting
		deleteErrors = requesterInfo.errors
		requestDelete = async () => await requesterInfo.send({})
	}

	function resetDraft() {
		// TODO: Renewal of cash flow activity is temporary. To be uncommented next update.
		debitCashFlowActivityID = data.debit_cash_flow_activity_id === null
			? `${NO_CASH_FLOW_ACTIVITY.id}`
			: `${data.debit_cash_flow_activity_id}`
		creditCashFlowActivityID = data.credit_cash_flow_activity_id === null
			? `${NO_CASH_FLOW_ACTIVITY.id}`
			: `${data.credit_cash_flow_activity_id}`
		name = data.name
		description = data.description
	}

	function fallbackToAceptableKind(kind: string): AcceptableModifierKind {
		return isAcceptableKind(kind) ? kind : acceptableModifierKinds[0]
	}

	function isAcceptableKind(kind: string): kind is AcceptableModifierKind {
		return (<string[]>[ ...acceptableModifierKinds ]).indexOf(kind) > -1
	}

	function fallbackToAceptableAction(action: string): AcceptableModifierAction {
		return isAcceptableAction(action) ? action : acceptableModifierActions[0]
	}

	function isAcceptableAction(action: string): action is AcceptableModifierAction {
		return (<string[]>[ ...acceptableModifierActions ]).indexOf(action) > -1
	}
</script>

<CollectionItem
	kind="normal"
	label={data.name}
	updateErrors={updateErrors}
	{requestUpdate}
	isConnectingToDelete={$isConnectingToDelete}
	deleteErrors={deleteErrors}
	{requestDelete}
	on:resetDraft={resetDraft}>
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		id={formID}
		bind:debitAccountID={debitAccountID}
		bind:creditAccountID={creditAccountID}
		bind:debitCashFlowActivityID={debitCashFlowActivityID}
		bind:creditCashFlowActivityID={creditCashFlowActivityID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		bind:action={action}
		isConnecting={$isConnectingToUpdate}
		{IDPrefix}
		{currencies}
		{accounts}
		{cashFlowActivities}
		errors={$updateErrors}
		{forceDisabledFields}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={$isConnectingToUpdate}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<ShortParagraph slot="delete_confirmation_message">
		Deleting this modifier may prevent other data from showing.
	</ShortParagraph>
	<svelte:fragment slot="resource_info">
		<Flex direction="row" mustPad={false}>
			{#if convertSnakeCaseToProperCase(resolvedDescription) !== "None"}
				<ShortParagraph>
					{resolvedDescription}
				</ShortParagraph>
			{/if}
			<ShortParagraph>
				The {friendlyKind} modifier {friendlyAction}
				the debited “{debitAccount.name}”
				{#if hasDebitCashFlowActivity}
					(debited cash flow is considered under “{friendlyDebitActivityName}”)
				{/if}
				and credited “{creditAccount.name}”
				{#if hasCreditCashFlowActivity}
					(credited cash flow is considered under “{friendlyCreditActivityName}”)
				{/if}.
			</ShortParagraph>
		</Flex>
</svelte:fragment>
</CollectionItem>
