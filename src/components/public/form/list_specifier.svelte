<script lang="ts">
import type { Snippet } from "svelte"
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

let {
	searchMode = $bindable(),
	sortCriterion = $bindable(),
	sortOrder = $bindable(),
	availableSearchModes = [
		SEARCH_NORMALLY_OPTION,
		SEARCH_ONLY_DELETED_OPTION
	],
	availableSortCriteria,
	availableSortOrders = [
		...SORT_ORDERS
	],
	isConnecting,
	errors,
	after_presence_field
}: {
	searchMode: SearchMode|null
	sortCriterion: string
	sortOrder: SortOrder
	availableSearchModes?: ChoiceInfo[]
	availableSortCriteria: string[]
	availableSortOrders?: string[]
	isConnecting: boolean
	errors: GeneralError[]
	after_presence_field?: Snippet
} = $props()

function returnChoiceAgain(choice: ChoiceInfo): ChoiceInfo {
	return choice
}

let simpleErrors = $derived(errors.filter(isSimpleError))
let hasSimpleErrors = $derived(simpleErrors.length > 1)
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
{@render after_presence_field?.()}
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
