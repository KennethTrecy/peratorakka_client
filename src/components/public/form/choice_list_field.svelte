<script lang="ts">
	import type { ChoiceInfo } from "+/component"
	import type { GeneralError } from "+/rest"

	import { onMount } from "svelte"
	import { MDCSelect } from "@material/select";
	import { MDCMenu } from "@material/menu";
	import { MDCMenuSurface } from "@material/menu-surface";

	import { UNKNOWN_OPTION } from "#/component"

	import { isFieldError } from "+/rest"

	const UNKNOWN_OPTION_LABEL = "Please select one of the choices..."

	export let fieldName: string
	export let errorFieldName: string|null = null
	export let disabled: boolean
	export let value: string
	export let IDPrefix: string = ""
	export let errors: GeneralError[]
	export let rawChoices: unknown[]
	export let choiceConverter: (choice: any) => ChoiceInfo

	$: {
		if (value === UNKNOWN_OPTION && rawChoices.length > 0) {
			value = choiceConverter(rawChoices[0]).data
		}
	}

	$: normalizedFieldName = errorFieldName === null
		? fieldName.replace(" ", "_").toLocaleLowerCase()
		: errorFieldName
	$: fieldID = (
			IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + normalizedFieldName
	$: labelID = `${fieldID}_label`
	$: helperID = `${fieldID}_helper`
	$: message = errors.filter(
		error => isFieldError(error) && error.field.endsWith(normalizedFieldName)
	).map(error => error.message).join(" ")
	$: choices = rawChoices.map(choiceConverter)
	$: selectedLabelIndex = choices.findIndex(choice => choice.data === value)
	$: selectedLabel = selectedLabelIndex === -1
		? UNKNOWN_OPTION_LABEL
		: choices[selectedLabelIndex].label
	$: selectClasses = [
		"mdc-select",
		"mdc-select--outlined",
		disabled ? "mdc-select--disabled" : false
	].filter(Boolean).join(" ")

	let selectElement: any = null
	let menuElement: any = null
	onMount(() => {
		const select = new MDCSelect(selectElement)
		const menu = new MDCMenu(menuElement)
		const menuSurface = new MDCMenuSurface(menuElement)
		select.listen("MDCSelect:change", () => {
			value = select.value
		})
	})
</script>

<div class={selectClasses} bind:this={selectElement}>
	<div
		class="mdc-select__anchor"
		aria-labelledby={labelID}
		aria-controls={helperID}
		aria-describedby={helperID}
		aria-disabled={disabled}
		title={selectedLabel}>
		<span class="mdc-notched-outline">
			<span class="mdc-notched-outline__leading"></span>
			<span class="mdc-notched-outline__notch">
				<span
					id={labelID}
					class="mdc-floating-label mdc-floating-label--float-above">
					{fieldName}
				</span>
			</span>
			<span class="mdc-notched-outline__trailing"></span>
		</span>
		<span class="mdc-select__selected-text-container">
			<span class="mdc-select__selected-text">
				{selectedLabel}
			</span>
		</span>
		<span class="mdc-select__dropdown-icon">
			<span class="mdc-select__dropdown-icon-graphic">
				<i class="mdc-select__dropdown-icon-inactive">
					arrow_drop_down
				</i>
				<i class="mdc-select__dropdown-icon-active">
					arrow_drop_up
				</i>
			</span>
		</span>
	</div>
	<div
		class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth"
		bind:this={menuElement}>
		<ul class="mdc-deprecated-list" role="listbox" aria-label={fieldName}>
			{#each choices as { label, data }(data)}
				<li
					class="mdc-deprecated-list-item mdc-deprecated-list-item--selected"
					aria-selected={`${(data === value)}`}
					data-value={data}
					role="option"
					title={label}>
					<span class="mdc-deprecated-list-item__ripple"></span>
					<span class="mdc-deprecated-list-item__text">
						{label}
					</span>
				</li>
			{/each}
			{#if value === UNKNOWN_OPTION}
				<li
					class="mdc-deprecated-list-item mdc-deprecated-list-item--selected"
					aria-selected="true"
					data-value={UNKNOWN_OPTION}
					role="option"
					title={UNKNOWN_OPTION_LABEL}>
					<span class="mdc-deprecated-list-item__ripple"></span>
					<span class="mdc-deprecated-list-item__text">
						{UNKNOWN_OPTION_LABEL}
					</span>
				</li>
			{/if}
		</ul>
	</div>
</div>
{#if message !== ""}
	<div class="mdc-text-field-helper-line">
		<p class="mdc-text-field-helper-text" id={helperID}>{message}</p>
	</div>
{/if}

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/list";
	@use "@material/menu-surface/mdc-menu-surface";
	@use "@material/menu/mdc-menu";
	@use "@material/floating-label/mdc-floating-label";
	@use "@material/notched-outline/mdc-notched-outline";
	@use "@material/select/styles";

	@include list.deprecated-core-styles;

	.mdc-select__dropdown-icon {
		font-size: 1.5rem;
	}

	.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {
		color: inherit;
	}
</style>
