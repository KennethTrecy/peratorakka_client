<script lang="ts">
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import TextField from "$/form/text_field.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"

	export let isConnecting: boolean

	export let beginDate: string
	export let endDate: string
	export let searchMode: SearchMode
	export let sortCriterion: string
	export let sortOrder: SortOrder
	export let listError: GeneralError[]

	const availableSortCriteria = [
		"transacted_at",
		"created_at"
	]
</script>

<TextField
	variant="date"
	fieldName="Begin Date"
	errorFieldName="begin_date"
	disabled={isConnecting}
	bind:value={beginDate}
	errors={listError}/>
<TextField
	variant="date"
	fieldName="End Date"
	errorFieldName="end_at"
	disabled={isConnecting}
	bind:value={endDate}
	errors={listError}/>
<ListSpecifier
	bind:searchMode={searchMode}
	bind:sortCriterion={sortCriterion}
	bind:sortOrder={sortOrder}
	{isConnecting}
	{availableSortCriteria}
	errors={listError}/>
