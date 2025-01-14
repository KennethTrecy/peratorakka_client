<script lang="ts">
import type { Currency, NumericalTool, AcceptableFormulaOutputFormat } from "+/entity"
import type { NumericalToolConclusion, AcceptableConstellationKind, Constellation } from "+/rest"
import type { AutocolorsOptions } from "chartjs-plugin-autocolors"

import autocolors from "chartjs-plugin-autocolors"
import { Pie } from "svelte-chartjs"
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale
} from "chart.js"

import { ACCEPTABLE_CONSTELLATION_KINDS } from "#/rest"

import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import formatStar from "$/utility/format_star"
import formatPercentage from "$/utility/format_percentage"

import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import NumberVisualizer from "%/dashboard/dashboard_card/number.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

export let numericalTool: NumericalTool
export let currency: Currency|null
export let outputFormat: AcceptableFormulaOutputFormat
export let conclusion: NumericalToolConclusion

$: timeTags = conclusion.time_tags
$: timeTagCount = timeTags.length
$: constellations = conclusion.constellations
$: hasMultipleTimes = timeTags.length > 1

$: reducedConstellations = constellations.filter(
	constellation => constellation.stars.some(star => star.numerical_value !== 0)
)
$: constellationGroups = reducedConstellations.reduce((groups, constellation) => ({
	...groups,
	[constellation.kind]: typeof groups[constellation.kind] === "undefined" ? [
		constellation
	] : [
		...groups[constellation.kind],
		constellation
	]
}), {} as Record<AcceptableConstellationKind, Constellation[]>)
$: constellationCollection = ACCEPTABLE_CONSTELLATION_KINDS.map(kind => ({
	kind,
	"group": constellationGroups[kind] ?? []
})).filter(collection => collection.group.length > 0)
$: constellationInfo = constellationCollection.map(collection => {
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

							const rawAmount = collection.group[j].stars[timeTagCount - i - 1]
							const amount = formatStar(outputFormat, currency, rawAmount)
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
})

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, autocolors)
</script>

{#each constellationInfo as constellationDatum, i}
	{#if constellationCollection[i].group.length === 1}
		<NumberVisualizer
			{numericalTool}
			{currency}
			{outputFormat}
			conclusion={{
				"time_tags": timeTags,
				"constellations": constellationCollection[i].group
			}}/>
	{:else}
		<GridCell
			kind={constellationCollection[i].group.length < 10 ? "triad" : "almost_full"}
			rowSpan={constellationCollection[i].group.length < 10 ? 3 * 2 : 5 * 2}>
			<article class="card">
				<div class="card-content">
					<Flex mustPad={false} justifyContent="center">
						<WeakenedTertiaryHeading>
							Composition of {convertSnakeCaseToProperCase(constellationDatum.name)}s
							(instructed by {numericalTool.name})
						</WeakenedTertiaryHeading>
						<Pie data={constellationDatum.chartInfo} options={constellationDatum.options}/>
						<ShortParagraph>
							The pie chart above shows the data from {timeTags[0]}{#if
							hasMultipleTimes}&nbsp;(inner pie) to {timeTags[timeTagCount - 1]} (outer
							pie){/if}.
						</ShortParagraph>
					</Flex>
				</div>
			</article>
		</GridCell>
	{/if}
{/each}

<style lang="scss">
@use "@/components/third-party/index";

.card {
	height: 100%;
}
</style>
