<script lang="ts">
import type { Currency, Formula, NumericalTool } from "+/entity"
import type { NumericalToolConclusion } from "+/rest"

import { createEventDispatcher, onMount } from "svelte"

import {
	NUMBER_NUMERICAL_TOOL_KIND,
	PIE_NUMERICAL_TOOL_KIND,
	LINE_NUMERICAL_TOOL_KIND,
	CURRENCY_FORMULA_OUTPUT_FORMAT,
	RAW_FORMULA_OUTPUT_FORMAT
} from "#/entity"

import { fallbackToAcceptableFormulaOutputFormat } from "+/entity"

import NumberVisualizer from "%/dashboard/dashboard_card/number.svelte"
import PieVisualizer from "%/dashboard/dashboard_card/pie.svelte"
import LineVisualizer from "%/dashboard/dashboard_card/line.svelte"

export let data: NumericalTool
export let formulae: Formula[]
export let currencies: Currency[]
export let conclusion: NumericalToolConclusion|null

$: hasLoaded = conclusion !== null
$: currency = hasLoaded ? (currencies[0] ?? null) : null

$: outputFormat = data.configuration.sources[0].type === "collection"
	? CURRENCY_FORMULA_OUTPUT_FORMAT
	: data.configuration.sources[0].type === "formula"
		? fallbackToAcceptableFormulaOutputFormat(
			formulae.find(
				formula =>
					data.configuration.sources[0].type === "formula"
					&& formula.id === data.configuration.sources[0].formula_id
			)?.output_format ?? RAW_FORMULA_OUTPUT_FORMAT
		) : RAW_FORMULA_OUTPUT_FORMAT
</script>

{#if conclusion === null}
	<p>Loading..</p>
{:else}
	{#if data.kind === NUMBER_NUMERICAL_TOOL_KIND}
		<NumberVisualizer
			numericalTool={data}
			{currency}
			{outputFormat}
			{conclusion}/>
	{:else if data.kind === PIE_NUMERICAL_TOOL_KIND}
		<PieVisualizer
			numericalTool={data}
			{currency}
			{outputFormat}
			{conclusion}/>
	{:else if data.kind === LINE_NUMERICAL_TOOL_KIND}
		<LineVisualizer
			numericalTool={data}
			{currency}
			{outputFormat}
			{conclusion}/>
	{/if}
{/if}
