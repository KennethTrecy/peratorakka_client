<script lang="ts">
	import type { FrozenPeriod, SummaryCalculation } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/frozen_periods/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	const dispatch = createEventDispatcher<{
		"create": FrozenPeriod
	}>()
	const IDPrefix = "new_"
	const previousDate =  new Date()
	previousDate.setMonth(previousDate.getMonth() - 1)
	const previousYear =  previousDate.getFullYear()
	const previousMonth =  makeTwoDigits(previousDate.getMonth() + 1)
	const previousDay =  makeTwoDigits(previousDate.getDate())

	const currentDate =  new Date()
	const currentYear =  currentDate.getFullYear()
	const currentMonth =  makeTwoDigits(currentDate.getMonth() + 1)
	const currentDay =  makeTwoDigits(currentDate.getDate())

	const defaultStartedDate = `${previousYear}-${previousMonth}-${previousDay}`
	const defaultFinishedDate = `${currentYear}-${currentMonth}-${currentDay}`

	export let isLoadingInitialData: boolean

	let startedAt: string = defaultStartedDate
	let finishedAt: string = defaultFinishedDate

	let { isConnecting, errors, send } = makeJSONRequester({
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
					errors.set([])
					dispatch("create", frozenPeriod)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createFrozenPeriod() {
		await send({
			"body": JSON.stringify({
				"financial_entry": {
					"started_at": `${startedAt} 00:00:00`,
					"finished_at": `${finishedAt} 11:59:59`
				}
			})
		})
	}

	function makeTwoDigits(value: number): string {
		return value <= 9 ? `0${value}` : `${value}`
	}
</script>

<DescriptiveForm
	individualName="Frozen Period"
	mayShowForm={true}
	{isLoadingInitialData}
	descriptionSize="wide"
	formSize="narrow">
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
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createFrozenPeriod}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="button"
				disabled={$isConnecting}
				label="Check"/>
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Submit"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
