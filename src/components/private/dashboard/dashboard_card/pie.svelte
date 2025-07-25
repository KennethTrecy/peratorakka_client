<script lang="ts">
import type { Writable } from "svelte/store"
import type { PrecisionFormat, Currency, Formula, NumericalToolConfiguration } from "+/entity"
import type {
	GeneralError,
	NumericalToolConclusion,
	AcceptableConstellationKind,
	Constellation
} from "+/rest"
import type { AutocolorsOptions } from "chartjs-plugin-autocolors"

import autocolors from "chartjs-plugin-autocolors"
import { Pie } from "svelte5-chartjs"
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale
} from "chart.js"

import { ACCEPTABLE_CONSTELLATION_KINDS } from "#/rest"
import { CURRENCY_FORMULA_OUTPUT_FORMAT } from "#/entity"

import { fallbackToAcceptableFormulaOutputFormat } from "+/entity"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import formatStar from "$/utility/format_star"
import formatPercentage from "$/utility/format_percentage"

import BaseCard from "%/dashboard/dashboard_card/base.svelte"
import NumberVisualizer from "%/dashboard/dashboard_card/number.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	currencyPrecisionFormat,
	currency,
	formulae,
	precisionFormats,
	name,
	configuration,
	referenceDate,
	conclusion,
	IDPrefix,
	formID,
	isConnecting,
	errors,
	view,
	refresh
}: {
	currency: Currency|null
	currencyPrecisionFormat: PrecisionFormat|null
	formulae: Formula[]
	precisionFormats: PrecisionFormat[]
	name: string
	configuration: NumericalToolConfiguration
	referenceDate: string
	conclusion: NumericalToolConclusion
	IDPrefix: string
	formID: string
	isConnecting: Writable<boolean>
	errors: Writable<GeneralError[]>
	view: (referenceDate: string) => Promise<void>
	refresh: () => Promise<void>
} = $props()

let timeTags = $derived(conclusion.time_tags)
let timeTagCount = $derived(timeTags.length)
let constellations = $derived(conclusion.constellations)
let hasMultipleTimes = $derived(timeTags.length > 1)

let reducedConstellations = $derived(constellations.filter(
	constellation => constellation.stars.some(star => star.numerical_value !== 0)
))
let constellationGroups = $derived(reducedConstellations.reduce((groups, constellation) => ({
	...groups,
	[constellation.kind]: typeof groups[constellation.kind] === "undefined" ? [
		constellation
	] : [
		...groups[constellation.kind],
		constellation
	]
}), {} as Record<AcceptableConstellationKind, Constellation[]>))
let constellationCollection = $derived(ACCEPTABLE_CONSTELLATION_KINDS.map(kind => ({
	kind,
	"group": constellationGroups[kind] ?? []
})).filter(collection => collection.group.length > 0))
let constellationInfo = $derived(constellationCollection.map(collection => {
	const labels = collection.group.map(constellation => constellation.name)
	return {
		"name": collection.kind,
		"chartInfo": {
			labels,
			"datasets": timeTags.map((_, i) => ({
				"data": collection.group.map(
					constellation => constellation.stars[timeTagCount - i - 1].numerical_value
				)
			}))
		},
		"options": {
			"responsive": true,
			"animation": false,
			"plugins": {
				"autocolors": {
					"mode": "data" as AutocolorsOptions["mode"]
				},
				"tooltip": {
					"callbacks": {
						"title": function(context: any) {
							const i = context[0].datasetIndex
							const j = context[0].dataIndex

							return `${labels[j]} (${timeTags[timeTagCount - i - 1]})`
						},
						"label": function(context: any) {
							const i = context.datasetIndex
							const j = context.dataIndex
							const name = labels[j]
							const foundFormula = formulae.find(formula => formula.name === name)
							const isFormulaKnownAsSource = configuration.sources.some(
								source =>
									source.type === "formula"
									&& source.formula_id === foundFormula?.id
							)
							const outputFormat = isFormulaKnownAsSource
								? fallbackToAcceptableFormulaOutputFormat(
									foundFormula?.output_format ?? CURRENCY_FORMULA_OUTPUT_FORMAT
								) : CURRENCY_FORMULA_OUTPUT_FORMAT
							const precisionFormat = isFormulaKnownAsSource
								? precisionFormats.find(precisionFormat => {
									return precisionFormat.id === foundFormula?.precision_format_id
								}) ?? currencyPrecisionFormat
								: currencyPrecisionFormat

							const rawAmount = collection.group[j].stars[timeTagCount - i - 1]
							const amount = formatStar(outputFormat, precisionFormat, currency, rawAmount)
							const sum = collection.group.reduce(
								function (previousSum, constellation) {
									const amount = constellation.stars[timeTagCount - i - 1].numerical_value
									return previousSum + amount
								},
								0
							)
							const percentage = formatPercentage(rawAmount.numerical_value, sum, 2)

							return `${amount} (${percentage})`
						}
					}
				}
			}
		}
	}
}))

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, autocolors)
</script>

{#each constellationInfo as constellationDatum, i}
	{#if constellationCollection[i].group.length === 1 && false}
		<NumberVisualizer
			{currencyPrecisionFormat}
			{currency}
			{formulae}
			{precisionFormats}
			{name}
			{configuration}
			{referenceDate}
			conclusion={{
				"time_tags": timeTags,
				"constellations": constellationCollection[i].group
			}}
			IDPrefix={`group_${i}_${IDPrefix}`}
			formID={`group_${i}_${formID}`}
			{isConnecting}
			{errors}
			{view}
			{refresh}/>
	{:else}
		{@const cardName = `Composition of ${
			convertSnakeCaseToProperCase(constellationDatum.name)
		}s (instructed by ${name})`}
		<BaseCard
			kind={constellationCollection[i].group.length < 10 ? "triad" : "almost_full"}
			rowSpan={constellationCollection[i].group.length < 10 ? 3 * 2 : 5 * 2}
			name={cardName}
			{referenceDate}
			{IDPrefix}
			{formID}
			{isConnecting}
			{errors}
			{view}
			{refresh}>
			{#snippet resource_info()}
				<Pie data={constellationDatum.chartInfo} options={constellationDatum.options}/>
				<ShortParagraph>
					The pie chart above shows the data from {timeTags[0]}{#if
					hasMultipleTimes}&nbsp;(inner pie) to {timeTags[timeTagCount - 1]} (outer
					pie){/if}.
				</ShortParagraph>
			{/snippet}
		</BaseCard>
	{/if}
{/each}
