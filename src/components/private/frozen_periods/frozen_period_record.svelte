<script lang="ts">
import type { FrozenPeriod } from "+/entity"

import makeJSONRequester from "$/rest/make_json_requester"

import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"
import TextButton from "$/button/text.svelte"
import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

let {
	data,
	remove,
	check
}: {
	data: FrozenPeriod
	remove: (period: FrozenPeriod) => void
	check: (period: FrozenPeriod) => void
} = $props()

let isConfirmingDeletion = $state(false)

let id = `#${data.id}`
let startedAt = data.started_at.slice(0, "YYYY-MM-DD".length)
let finishedAt = data.finished_at.slice(0, "YYYY-MM-DD".length)

const { isConnecting, errors, send } = makeJSONRequester({
	"path": `/api/v2/frozen_periods/${data.id}/force`,
	"defaultRequestConfiguration": {
		"method": "DELETE",
	},
	"manualResponseHandlers": [
		{
			"statusCode": 204,
			"action": async (_response: Response) => {
				remove(data)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

function startReading() {
	isConfirmingDeletion = false
}

function confirmDeletion() {
	isConfirmingDeletion = true
}

async function confirmDelete() {
	await send({})
}

function checkCalculations() {
	check(data)
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
			<article class="card">
				<div class="card-content">
					<Flex mustPad={false}>
						<WeakenedTertiaryHeading>
							Delete frozen period {id}?
						</WeakenedTertiaryHeading>
						<ShortParagraph>
							Are you sure to delete the frozen period?
						</ShortParagraph>
						{#each $errors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					</Flex>
				</div>
				<div class="card-action">
					<TextButton
						kind="button"
						disabled={$isConnecting}
						label="Confirm"
						onclick={confirmDelete}/>
					<TextButton
						kind="button"
						disabled={$isConnecting}
						label="Cancel"
						onclick={startReading}/>
				</div>
			</article>
		{:else}
			<TextButton
				kind="button"
				label="Check"
				onclick={checkCalculations}/>
			<TextButton
				kind="button"
				label="Force Delete"
				onclick={confirmDeletion}/>
		{/if}
	</DataTableCell>
</DataTableRow>
