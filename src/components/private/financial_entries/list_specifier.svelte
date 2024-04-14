<script lang="ts">
	import type { Currency, Account, Modifier, FinancialEntry } from "+/entity"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import TextField from "$/form/text_field.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"

	const currentDate =  new Date()
	const currentYear =  currentDate.getFullYear()
	const currentMonth =  makeTwoDigits(currentDate.getMonth() + 1)
	const currentDay =  makeTwoDigits(currentDate.getDate())
	const defaultTransactedDate = `${currentYear}-${currentMonth}-${currentDay}`

	export let isConnecting: boolean

	export let searchMode: SearchMode
	export let sortCriterion: string
	export let sortOrder: SortOrder
	export let listError: GeneralError[]

	export let startedAt: string = defaultTransactedDate
	export let finishedAt: string = defaultTransactedDate

	const availableSortCriteria = [
		"transacted_at",
		"created_at"
	]

	function makeTwoDigits(value: number): string {
		return value <= 9 ? `0${value}` : `${value}`
	}
</script>

<ListSpecifier
	bind:searchMode={searchMode}
	bind:sortCriterion={sortCriterion}
	bind:sortOrder={sortOrder}
	{isConnecting}
	{availableSortCriteria}
	errors={listError}/>
<TextField
	variant="date"
	fieldName="Started Date"
	errorFieldName="started_at"
	disabled={isConnecting}
	bind:value={startedAt}
	errors={listError}/>
<TextField
	variant="date"
	fieldName="Finished Date"
	errorFieldName="finished_at"
	disabled={isConnecting}
	bind:value={finishedAt}
	errors={listError}/>
