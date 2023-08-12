<script lang="ts">
	import type { ChoiceInfo } from "+/component"
	import type { GeneralError } from "+/rest"

	import { isFieldError } from "+/rest"

	export let fieldName: string
	export let errorFieldName: string|null = null
	export let disabled: boolean
	export let value: string
	export let IDPrefix: string = ""
	export let errors: GeneralError[]
	export let rawChoices: unknown[]
	export let choiceConverter: (choice: any) => ChoiceInfo

	$: normalizedFieldName = errorFieldName === null
		? fieldName.replace(" ", "_").toLocaleLowerCase()
		: errorFieldName
	$: fieldID = (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + normalizedFieldName
	$: message = errors.filter(
		error => isFieldError(error) && error.field.endsWith(normalizedFieldName)
	).map(error => error.message).join(" ")
	$: choices = rawChoices.map(choiceConverter)
</script>

<div class="field label border no-margin">
	<select
		id={fieldID}
		class="active"
		{disabled}
		bind:value={value}>
		{#if value === ""}
			<option {value}>
				Please select one of the choices...
			</option>
		{/if}
		{#each choices as { label, data }(data)}
			<option value={data}>
				{label}
			</option>
		{/each}
	</select>
	<label class="active" for={fieldID}>{fieldName}</label>
	<i>arrow_drop_down</i>
	{#if message !== ""}
		<p class="error no-margin">{message}</p>
	{/if}
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	p {
		@extend span;
	}
</style>
