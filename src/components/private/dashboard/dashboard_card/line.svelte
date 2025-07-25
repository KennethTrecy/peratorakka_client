<script lang="ts">
import type { Readable, Writable } from "svelte/store"
import type { PrecisionFormat, Currency, Formula, NumericalToolConfiguration } from "+/entity"
import type { GeneralError, NumericalToolConclusion } from "+/rest"
import type { ContextBundle, GridCellKind } from "+/component"
import type { ChartOptions } from "chart.js"
import type { AutocolorsOptions } from "chartjs-plugin-autocolors"

import autocolors from "chartjs-plugin-autocolors"
import { Line } from "svelte5-chartjs"
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	CategoryScale
} from "chart.js"
import { getContext, onMount, onDestroy } from "svelte"
import { get } from "svelte/store"

import { GLOBAL_CONTEXT } from "#/contexts"
import { CURRENCY_FORMULA_OUTPUT_FORMAT } from "#/entity"

import { fallbackToAcceptableFormulaOutputFormat } from "+/entity"
import formatStar from "$/utility/format_star"

import BaseCard from "%/dashboard/dashboard_card/base.svelte"
import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle as {
	mustBeInDarkMode: Readable<boolean>
}

let mustBeInDarkMode = $state(false)
onMount(() => {
	mustBeInDarkMode = get(globalContext.mustBeInDarkMode)
})
onDestroy(globalContext.mustBeInDarkMode.subscribe(newMustBeInDarkMode => {
	mustBeInDarkMode = newMustBeInDarkMode
}))

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
let constellationInfo = $derived({
	"labels": timeTags,
	"datasets": reducedConstellations.map((constellation, i) => ({
		"label": constellation.name,
		"data": constellation.stars.map(star => star.numerical_value),
		"lineTension": 0.2
	}))
})
let options = $derived({
	"responsive": true,
	"animation": false as ChartOptions<"line">["animation"],
	"scales": {
		"x": {
			"grid": {
				"color": mustBeInDarkMode ? "#AAAAAA40" : "#44444440"
			}
		},
		"y": {
			"grid": {
				"color": mustBeInDarkMode ? "#AAAAAA40" : "#44444440"
			}
		}
	},
	"plugins": {
		"autocolors": {
			"mode": "dataset" as AutocolorsOptions["mode"]
		},
		"tooltip": {
			"callbacks": {
				"title": function(context: any) {
					return context.map((subcontext: any) => {
						const i = subcontext.datasetIndex
						const j = subcontext.dataIndex
						return `${reducedConstellations[i].name} (${timeTags[j]})`
					})
				},
				"label": function(context: any) {
					const i = context.datasetIndex
					const j = context.dataIndex
					const name = reducedConstellations[i].name
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

					return formatStar(
						outputFormat,
						precisionFormat,
						currency,
						reducedConstellations[i].stars[j]
					)
				}
			}
		}
	}
})

let cardName = $derived(`${name} Line Chart`)
let kind = $derived<GridCellKind>(
	timeTags.length < 7
		? "pair"
		: (
			timeTags.length < 10
				? "almost_full"
				: "full"
		)
)
let rowSpan = $derived(timeTags.length < 7 ? 3 * 2 - 1 : 4 * 2)

ChartJS.register(
	Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, autocolors
)
</script>

<BaseCard
	{kind}
	{rowSpan}
	name={cardName}
	{referenceDate}
	{IDPrefix}
	{formID}
	{isConnecting}
	{errors}
	{view}
	{refresh}>
	{#snippet resource_info()}
		<Flex mustPad={false}>
			<Line data={constellationInfo} {options}/>
			<ShortParagraph>
				The line chart above shows the data from {timeTags[0]}{#if hasMultipleTimes}&nbsp; to {timeTags[timeTagCount - 1]}{/if}.
			</ShortParagraph>
		</Flex>
	{/snippet}
</BaseCard>
