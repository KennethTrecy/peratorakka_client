<script lang="ts">
import type { Currency, NumericalTool, AcceptableFormulaOutputFormat } from "+/entity"
import type { NumericalToolConclusion } from "+/rest"

import formatStar from "$/utility/format_star"

import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

export let numericalTool: NumericalTool
export let currency: Currency|null
export let outputFormat: AcceptableFormulaOutputFormat
export let conclusion: NumericalToolConclusion

$: timeTags = conclusion.time_tags
$: constellations = conclusion.constellations
$: hasMultipleTimes = timeTags.length > 1
$: reducedConstellations = constellations.filter(
	constellation => constellation.stars.some(star => star.numerical_value !== 0)
)
</script>

{#each reducedConstellations as constellation, i}
	<GridCell kind="narrow" class="number">
		<article class="card">
			<div class="card-content">
				<Flex mustPad={false}>
					<WeakenedTertiaryHeading>
						{formatStar(outputFormat, currency, constellation.stars[0])}
					</WeakenedTertiaryHeading>
					<ShortParagraph>
						{constellation.name} for {timeTags[0]}. This card follows instructions from numerical tool named "{numericalTool.name}". {#if hasMultipleTimes}Previous values can be seen below.{/if}
					</ShortParagraph>
					{#if hasMultipleTimes}
						<ul>
							{#each constellation.stars as star, i}
								{#if i > 0}
									<li>{timeTags[i]}: {formatStar(outputFormat, currency, star)}</li>
								{/if}
							{/each}
						</ul>
					{/if}
				</Flex>
			</div>
		</article>
	</GridCell>
{/each}


<style lang="scss">
@use "@/components/third-party/index";

:global(.number) {
	grid-row: span 1;
}
</style>
