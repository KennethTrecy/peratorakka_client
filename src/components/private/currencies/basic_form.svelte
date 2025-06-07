<script lang="ts">
import type { GeneralError } from "+/rest"
import type { PrecisionFormat } from "+/entity"

import transformPrecisionFormat from "$/form/choice_info_transformer/transform_precision_format"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"

export let IDPrefix: string
export let precisionFormats: PrecisionFormat[]

export let precisionFormatID: string
export let code: string
export let name: string

export let isConnecting: boolean
export let errors: GeneralError[]
export let id: string|null = null

$: precisionFormat = precisionFormats.find(
	precisionFormat => `${precisionFormat.id}` === precisionFormatID
)
$: supportText = typeof precisionFormat === "undefined"
	? ""
	: `Selected precision format may ${
		precisionFormat.minimum_presentational_precision === 0
		&& precisionFormat.maximum_presentational_precision === 0
		? "Selected precision format would not shown any decimal places."
		: `show ${
			precisionFormat.minimum_presentational_precision === 0
				? ""
				: `at least ${
					precisionFormat.minimum_presentational_precision
				} decimal places and `
		} ${precisionFormat.maximum_presentational_precision} decimal places at most.`
	}`
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Precision Format"
			errorFieldID="precision_format_id"
			disabled={isConnecting}
			bind:value={precisionFormatID}
			rawChoices={precisionFormats}
			choiceConverter={transformPrecisionFormat}
			{supportText}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Code"
			disabled={isConnecting}
			bind:value={code}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Name"
			disabled={isConnecting}
			bind:value={name}
			{IDPrefix}
			{errors}/>
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
