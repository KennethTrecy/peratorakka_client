<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { FrozenPeriod } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import makeJSONRequester from "$/rest/make_json_requester"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"
	import TextButton from "$/button/text.svelte"
	import Flex from "$/layout/flex.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

	export let data: FrozenPeriod

	let isConfirmingDeletion = false
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = () => Promise.resolve()

	const dispatch = createEventDispatcher<{
		"delete": FrozenPeriod
		"check": FrozenPeriod
	}>()
	let id = `#${data.id}`
	let startedAt = data.started_at.slice(0, "YYYY-MM-DD".length)
	let finishedAt = data.finished_at.slice(0, "YYYY-MM-DD".length)

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/frozen_periods/${data.id}/force`,
			"defaultRequestConfiguration": {
				"method": "DELETE",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						dispatch("delete", data)
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToDelete = requesterInfo.isConnecting
		deleteErrors = requesterInfo.errors
		requestDelete = async () => await requesterInfo.send({})
	}

	function startReading() {
		isConfirmingDeletion = false
	}

	function confirmDeletion() {
		isConfirmingDeletion = true
	}

	async function confirmDelete() {
		await requestDelete()
	}

	function checkCalculations() {
			dispatch("check", data)
	}
</script>

<DataTableRow>
	<DataTableHeader scope="row">
		{id}
	</DataTableHeader>
	<DataTableCell>
		{startedAt}
	</DataTableCell>
	<DataTableCell>
		{finishedAt}
	</DataTableCell>
	<DataTableCell>
		{#if isConfirmingDeletion}
			<article class="mdc-card">
				<div class="mdc-card__content">
					<Flex>
						<WeakenedTertiaryHeading>
							Delete frozen period {id}?
						</WeakenedTertiaryHeading>
						<ShortParagraph>
							Are you sure to delete the frozen period?
						</ShortParagraph>
					</Flex>
				</div>
				<div class="mdc-card__actions">
					<div class="mdc-card__action-buttons">
						<TextButton
							class="mdc-button--raised"
							kind="button"
							disabled={$isConnectingToDelete}
							label="Confirm"
							on:click={confirmDelete}/>
						<TextButton
							class="mdc-button--outlined"
							kind="button"
							disabled={$isConnectingToDelete}
							label="Cancel"
							on:click={startReading}/>
					</div>
				</div>
			</article>
		{:else}
			<TextButton
				class="mdc-button--raised"
				kind="button"
				label="Check"
				on:click={checkCalculations}/>
			<TextButton
				class="mdc-button--outlined"
				kind="button"
				label="Force Delete"
				on:click={confirmDeletion}/>
		{/if}
	</DataTableCell>
</DataTableRow>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";

	@include card.core-styles;
</style>
