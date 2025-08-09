<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	CompleteFinancialEntryAtomInput,
	CompoundFinancialEntryAtomInputMethod
} from "+/component"

import { compoundFinancialEntryInputMethods, FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY, FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL, FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY } from "#/component"

import transformString from "$/form/choice_info_transformer/transform_string"

import ChoiceListField from "$/form/choice_list_field.svelte"
import GeneralField from "%/financial_entries/basic_form/general_field.svelte"
import GeneralFieldset from "%/financial_entries/basic_form/general_fieldset.svelte"
	import { PRICE_FINANCIAL_ENTRY_ATOM_KIND, PRICE_MODIFIER_ATOM_KIND, QUANTITY_FINANCIAL_ENTRY_ATOM_KIND, TOTAL_FINANCIAL_ENTRY_ATOM_KIND } from "#/entity";
	import { divideAmount, multiplyAmount } from "!/index";

let COMPOUND_FINANCIAL_ENTRY_INPUT_METHODS = [ ...compoundFinancialEntryInputMethods ]

let {
	atom = $bindable(),
	IDPrefix,
	disabled,
	isConnecting,
	errors
}: {
	atom: CompleteFinancialEntryAtomInput
	IDPrefix: string
	disabled: boolean
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

function updateMethod(newMethod: string) {
	const newAtom = { ...atom }
	if (newAtom.method !== (newMethod as CompoundFinancialEntryAtomInputMethod)) {
		newAtom.method = newMethod as CompoundFinancialEntryAtomInputMethod

		const unusedInputs = []
		const usedInputs = []

		for(const inputElement of newAtom.input) {
			switch (inputElement.kind) {
				case TOTAL_FINANCIAL_ENTRY_ATOM_KIND: {
					switch (newMethod) {
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL:
						case FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY:
							usedInputs.push(inputElement)
							break;

						default:
							unusedInputs.push(inputElement)
					}

					break;
				}
				case PRICE_FINANCIAL_ENTRY_ATOM_KIND: {
					switch (newMethod) {
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL:
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY:
							usedInputs.push(inputElement)
							break;

						default:
							unusedInputs.push(inputElement)
					}

					break;
				}
				case QUANTITY_FINANCIAL_ENTRY_ATOM_KIND: {
					switch (newMethod) {
						case FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY:
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY:
							usedInputs.push(inputElement)
							break;

						default:
							unusedInputs.push(inputElement)
					}

					break;
				}
			}
		}

		if (usedInputs.length === 1 && unusedInputs.length === 1) {
			const unusedInputElement = unusedInputs[0]
			const usedInputElement = usedInputs[0]
			switch(usedInputElement.kind) {
				case TOTAL_FINANCIAL_ENTRY_ATOM_KIND: {
					switch (newMethod) {
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL:
							usedInputs.push({
								...unusedInputElement,
								"kind": PRICE_FINANCIAL_ENTRY_ATOM_KIND,
								"numerical_value": unusedInputElement.numerical_value === "0"
									? "0"
									: divideAmount(
										usedInputElement.numerical_value,
										unusedInputElement.numerical_value
									)
							})
							break;
						case FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY:
							usedInputs.push({
								...unusedInputElement,
								"kind": QUANTITY_FINANCIAL_ENTRY_ATOM_KIND,
								"numerical_value": unusedInputElement.numerical_value === "0"
									? "0"
									: divideAmount(
										usedInputElement.numerical_value,
										unusedInputElement.numerical_value
									)
							})
							break;
					}

					break;
				}
				case PRICE_FINANCIAL_ENTRY_ATOM_KIND: {
					switch (newMethod) {
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL:
							usedInputs.push({
								...unusedInputElement,
								"kind": TOTAL_FINANCIAL_ENTRY_ATOM_KIND,
								"numerical_value": multiplyAmount(
									usedInputElement.numerical_value,
									unusedInputElement.numerical_value
								)
							})
							break;
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY:
							usedInputs.push({
								...unusedInputElement,
								"kind": QUANTITY_FINANCIAL_ENTRY_ATOM_KIND,
								"numerical_value": usedInputElement.numerical_value === "0"
									? "0"
									: divideAmount(
										unusedInputElement.numerical_value,
										usedInputElement.numerical_value
									)
							})
							break;
					}

					break;
				}
				case QUANTITY_FINANCIAL_ENTRY_ATOM_KIND: {
					switch (newMethod) {
						case FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY:
							usedInputs.push({
								...unusedInputElement,
								"kind": TOTAL_FINANCIAL_ENTRY_ATOM_KIND,
								"numerical_value": multiplyAmount(
									usedInputElement.numerical_value,
									unusedInputElement.numerical_value
								)
							})
							break;
						case FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY:
							usedInputs.push({
								...unusedInputElement,
								"kind": PRICE_FINANCIAL_ENTRY_ATOM_KIND,
								"numerical_value": usedInputElement.numerical_value === "0"
									? "0"
									: divideAmount(
										unusedInputElement.numerical_value,
										usedInputElement.numerical_value
									)
							})
							break;
					}

					break;
				}
			}
		}

		if (usedInputs.length === 2) {
			newAtom.input = usedInputs
		}
	}
	atom = newAtom
}
</script>

<GeneralFieldset {atom}>
	<ChoiceListField
		fieldName="Input Method"
		disabled={isConnecting || disabled}
		bind:value={() => atom.method, method => updateMethod(method)}
		rawChoices={COMPOUND_FINANCIAL_ENTRY_INPUT_METHODS}
		choiceConverter={transformString}
		{IDPrefix}
		{errors}/>
	{#each atom.input as input, i(`${atom.method}_${i}_${input.kind}_${input.modifier_atom_id}`)}
		<GeneralField
			bind:atom={atom}
			inputIndex={i}
			{IDPrefix}
			{disabled}
			{isConnecting}
			{errors}/>
	{/each}
</GeneralFieldset>
