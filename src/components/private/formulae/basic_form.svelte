<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type {
	PrecisionFormat,
	Formula,
	AcceptableFormulaOutputFormat
} from "+/entity"

import { acceptableFormulaOutputFormats } from "#/entity"

import transformPrecisionFormat from "$/form/choice_info_transformer/transform_precision_format"
import transformString from "$/form/choice_info_transformer/transform_string"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"

const ACCEPTABLE_FORMULA_OUTPUT_FORMATS = [ ...acceptableFormulaOutputFormats ]

let {
	IDPrefix,
	precisionFormats,
	precisionFormatID = $bindable(),
	name = $bindable(),
	description = $bindable(),
	outputFormat = $bindable(),
	expression = $bindable(),
	forceDisabledFields = [],
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	precisionFormats: PrecisionFormat[]
	precisionFormatID: string
	name: string
	description: string
	outputFormat: AcceptableFormulaOutputFormat
	expression: string
	forceDisabledFields?: (keyof Formula)[]
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()
</script>

<BasicForm {id} {isConnecting} {errors} {onsubmit} {button_group}>
	{#snippet fields()}
		<TextField
			fieldName="Name"
			disabled={isConnecting || forceDisabledFields.includes("name")}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Description"
			disabled={isConnecting || forceDisabledFields.includes("description")}
			bind:value={description}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Output Format"
			disabled={isConnecting || forceDisabledFields.includes("output_format")}
			bind:value={outputFormat}
			rawChoices={ACCEPTABLE_FORMULA_OUTPUT_FORMATS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Precision Format"
			errorFieldID="precision_format_id"
			disabled={isConnecting || forceDisabledFields.includes("precision_format_id")}
			bind:value={precisionFormatID}
			rawChoices={precisionFormats}
			choiceConverter={transformPrecisionFormat}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Expression"
			disabled={isConnecting || forceDisabledFields.includes("expression")}
			bind:value={expression}
			{IDPrefix}
			{errors}/>
	{/snippet}
</BasicForm>
