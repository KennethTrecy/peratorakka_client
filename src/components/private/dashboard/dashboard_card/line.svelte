<script lang="ts">
import type { Currency, NumericalTool, AcceptableFormulaOutputFormat } from "+/entity"
import type { NumericalToolConclusion, AcceptableConstellationKind, Constellation } from "+/rest"

import { Line } from "svelte-chartjs"
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

import formatStar from "$/utility/format_star"
import generateColors from "$/utility/generate_colors"

import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
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
$: [ backgroundColor, hoverBackgroundColor ] = generateColors(reducedConstellations.length)
$: constellationInfo = {
	"labels": timeTags,
	"datasets": reducedConstellations.map((constellation, i) => ({
		"label": constellation.name,
		"data": constellation.stars.map(star => star.numerical_value),
		"backgroundColor": backgroundColor[i],
		"pointBackgroundColor": backgroundColor[i],
		"pointHoverBackgroundColor": hoverBackgroundColor[i],
		"fill": true,
		"lineTension": 0.2
	}))
}
$: options = {
	"responsive": true,
	"plugins": {
		"tooltip": {
			"callbacks": {
				"title": function(context: any) {
					const i = context[0].datasetIndex
					const j = context[0].dataIndex

					return `${reducedConstellations[i].name} (${timeTags[j]})`
				},
				"label": function(context: any) {
					const i = context.datasetIndex
					const j = context.dataIndex

					return formatStar(
						outputFormat,
						currency,
						reducedConstellations[i].stars[j]
					)
				}
			}
		}
	}
}

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)
</script>

<GridCell kind="pair" rowSpan={2}>
	<article class="card">
		<div class="card-content">
			<Flex mustPad={false} justifyContent="center">
				<WeakenedTertiaryHeading>
					{numericalTool.name} Line Chart
				</WeakenedTertiaryHeading>
				<Line data={constellationInfo} {options}/>
				<ShortParagraph>
					The line chart above shows the data from {timeTags[0]}{#if hasMultipleTimes}&nbsp; to {timeTags[timeTagCount - 1]}{/if}.
				</ShortParagraph>
			</Flex>
		</div>
	</article>
</GridCell>

<style lang="scss">
@use "@/components/third-party/index";

.card {
	height: 100%;
}
</style>
