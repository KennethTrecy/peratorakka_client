<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { PrecisionFormat } from "+/entity"

import transformPrecisionFormat from "$/form/choice_info_transformer/transform_precision_format"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"

let {
	IDPrefix,
	precisionFormats,
	precisionFormatID = $bindable(),
	name = $bindable(),
	unit = $bindable(),
	description = $bindable(),
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
	unit: string
	description: string
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()

let precisionFormat = $derived(precisionFormats.find(
	precisionFormat => `${precisionFormat.id}` === precisionFormatID
))
let supportText = $derived(typeof precisionFormat === "undefined"
	? ""
	: `Selected precision format may ${
		precisionFormat.minimum_presentational_precision === 0
		&& precisionFormat.maximum_presentational_precision === 0
		? "not shown any decimal places."
		: `show ${
			precisionFormat.minimum_presentational_precision === 0
				? ""
				: `at least ${
					precisionFormat.minimum_presentational_precision
				} decimal places and `
		} ${precisionFormat.maximum_presentational_precision} decimal places at most.`
	}`)
</script>

<BasicForm {id} {isConnecting} {errors} {onsubmit} {button_group}>
	{#snippet fields()}
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
			fieldName="Name"
			disabled={isConnecting}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Unit"
			disabled={isConnecting}
			bind:value={unit}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Description"
			disabled={isConnecting}
			bind:value={description}
			{IDPrefix}
			{errors}/>
	{/snippet}
</BasicForm>
