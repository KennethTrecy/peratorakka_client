<script lang="ts">
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import TextField from "$/form/text_field.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"

	export let isConnecting: boolean

	export let startedAt: string
	export let finishedAt: string
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
<ListSpecifier
	bind:searchMode={searchMode}
	bind:sortCriterion={sortCriterion}
	bind:sortOrder={sortOrder}
	{isConnecting}
	{availableSortCriteria}
	errors={listError}/>
