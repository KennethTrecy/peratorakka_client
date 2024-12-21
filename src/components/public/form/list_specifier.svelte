<script lang="ts">
import type { ChoiceInfo } from "+/component"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import {
	SEARCH_NORMALLY_OPTION,
	SEARCH_ONLY_DELETED_OPTION,
	SORT_ORDERS
} from "#/rest"

import { isSimpleError } from "+/rest"
import transformAttributeName from "$/form/choice_info_transformer/transform_attribute_name"
import transformString from "$/form/choice_info_transformer/transform_string"

import ChoiceListField from "$/form/choice_list_field.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextContainer from "$/typography/text_container.svelte"

export let searchMode: SearchMode|null
export let sortCriterion: string
export let sortOrder: SortOrder

export let availableSearchModes: unknown[] = [
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

$: simpleErrors = errors.filter(isSimpleError)
$: hasSimpleErrors = simpleErrors.length > 1
</script>

{#if searchMode !== null}
	<ChoiceListField
		fieldName="Presence"
		disabled={isConnecting}
		bind:value={searchMode}
		rawChoices={availableSearchModes}
		choiceConverter={returnChoiceAgain}
		{errors}/>
{/if}
<slot name="after_presence_field"/>
<ChoiceListField
	fieldName="Sort Criteria"
	disabled={isConnecting}
	bind:value={sortCriterion}
	rawChoices={availableSortCriteria}
	choiceConverter={transformAttributeName}
	{errors}/>
<ChoiceListField
	fieldName="Sort Order"
	disabled={isConnecting}
	bind:value={sortOrder}
	rawChoices={availableSortOrders}
	choiceConverter={transformString}
	{errors}/>
{#if hasSimpleErrors}
	<TextContainer>
		{#each simpleErrors as simpleError}
			<ShortParagraph>{simpleError.message}</ShortParagraph>
		{/each}
	</TextContainer>
{/if}
