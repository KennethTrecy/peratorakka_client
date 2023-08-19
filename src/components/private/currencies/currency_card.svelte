<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Currency } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/currencies/basic_form.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

	export let data: Currency

	const dispatch = createEventDispatcher<{
		"delete": Currency
	}>()
	let status: CardStatus = "reading"
	let code = data.code
	let name = data.name

	$: IDPrefix = `old_currency_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	$: isEditing = status === "editing"
	$: isConfirmingDeletion = status === "confirming_deletion"
	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = (request: Partial<RequestInit>) => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = (request: Partial<RequestInit>) => Promise.resolve()

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/currencies/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "PUT",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						data = {
							...data,
							code,
							name
						}
						updateErrors.set([])
						startReading()
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToUpdate = requesterInfo.isConnecting
		updateErrors = requesterInfo.errors
		requestUpdate = requesterInfo.send
	}

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/currencies/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "DELETE",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						deleteErrors.set([])
						dispatch("delete", data)
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToDelete = requesterInfo.isConnecting
		deleteErrors = requesterInfo.errors
		requestDelete = requesterInfo.send
	}

	function startReading() {
		status = "reading"
	}

	function startEditing() {
		status = "editing"
	}

	function confirmDeletion() {
		status = "confirming_deletion"
	}

	async function confirmEdit(event: SubmitEvent) {
		event.preventDefault()

		await requestUpdate({
			"body": JSON.stringify({
				"currency": {
					code,
					name
				}
			})
		})
	}

	async function confirmDelete() {
		await requestDelete({})
	}

	function cancelEdit() {
		startReading()
		code = data.code
		name = data.name
	}
</script>

<GridCell kind="narrow">
	{#if isEditing}
		<BasicForm
			id={formID}
			bind:code={code}
			bind:name={name}
			isConnecting={$isConnectingToUpdate}
			{IDPrefix}
			errors={$updateErrors}
			on:submit={confirmEdit}>
			<svelte:fragment slot="button_group">
				<TextCardButton
					kind="submit"
					disabled={$isConnectingToUpdate}
					label="Save"/>
				<TextCardButton
					kind="button"
					disabled={$isConnectingToUpdate}
					label="Cancel"
					on:click={cancelEdit}/>
			</svelte:fragment>
		</BasicForm>
	{:else}
		<article class="mdc-card">
			<div class="mdc-card__content">
				<Flex>
					{#if isConfirmingDeletion}
						<WeakenedTertiaryHeading>
							Delete {data.code}?
						</WeakenedTertiaryHeading>
						<ShortParagraph>
							Deleting this currency may prevent other data from showing.
						</ShortParagraph>
					{:else}
						<WeakenedTertiaryHeading>
							{data.code}
						</WeakenedTertiaryHeading>
						<ShortParagraph>
							{data.name}
						</ShortParagraph>
					{/if}
				</Flex>
			</div>
			<div class="mdc-card__actions">
				<div class="mdc-card__action-buttons">
					{#if isConfirmingDeletion}
						<TextCardButton
							kind="submit"
							disabled={$isConnectingToDelete}
							label="Confirm"
							on:click={confirmDelete}/>
						<TextCardButton
							kind="button"
							disabled={$isConnectingToDelete}
							label="Cancel"
							on:click={startReading}/>
					{:else}
						<TextCardButton
							kind="submit"
							label="Edit"
							on:click={startEditing}/>
						<TextCardButton
							kind="button"
							label="Delete"
							on:click={confirmDeletion}/>
					{/if}
				</div>
			</div>
		</article>
	{/if}
</GridCell>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";

	@include card.core-styles;
</style>
