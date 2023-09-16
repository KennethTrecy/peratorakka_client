<script lang="ts">
	import type { ChoiceInfo } from "+/component"
	import type { SearchMode, GeneralError } from "+/rest"

	import { SEARCH_NORMALLY_OPTION, SEARCH_ONLY_DELETED_OPTION } from "#/rest"

	import ChoiceListField from "$/form/choice_list_field.svelte"

	export let searchMode: SearchMode
	export let availableChoices: unknown[] = [
		SEARCH_NORMALLY_OPTION,
		SEARCH_ONLY_DELETED_OPTION
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
