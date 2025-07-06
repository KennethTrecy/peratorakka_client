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
	code = $bindable(),
	name = $bindable(),
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	precisionFormats: PrecisionFormat[]
	precisionFormatID: string
	code: string
	name: string
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
		? "Selected precision format would not shown any decimal places."
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
	{/snippet}
</BasicForm>
