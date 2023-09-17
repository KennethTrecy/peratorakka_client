<script lang="ts">
	import type { ChoiceInfo } from "+/component"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import {
		SEARCH_NORMALLY_OPTION,
		SEARCH_ONLY_DELETED_OPTION,
		SORT_ORDERS
	} from "#/rest"

	import transformString from "$/form/choice_info_transformer/transform_string"

	import ChoiceListField from "$/form/choice_list_field.svelte"

	export let searchMode: SearchMode
	export let sortCriterion: string
	export let sortOrder: SortOrder

	export let availableChoices: unknown[] = [
		SEARCH_NORMALLY_OPTION,
		SEARCH_ONLY_DELETED_OPTION
	]
	export let availableSortCriteria: unknown[]
	export let availableSortOrders: unknown[] = [
		...SORT_ORDERS
	]

	export let isConnecting: boolean
	export let errors: GeneralError[]

	function returnChoiceAgain(choice: ChoiceInfo): ChoiceInfo {
		return choice
	}

</script>

<ChoiceListField
	fieldName="Presence"
	disabled={isConnecting}
	bind:value={searchMode}
	rawChoices={availableChoices}
	choiceConverter={returnChoiceAgain}
	{errors}/>
<slot name="after_presence_field"/>
<ChoiceListField
	fieldName="Sort Criteria"
	disabled={isConnecting}
	bind:value={sortCriterion}
	rawChoices={availableSortCriteria}
	choiceConverter={transformString}
	{errors}/>
<ChoiceListField
	fieldName="Sort Order"
	disabled={isConnecting}
	bind:value={sortOrder}
	rawChoices={availableSortOrders}
	choiceConverter={transformString}
	{errors}/>
