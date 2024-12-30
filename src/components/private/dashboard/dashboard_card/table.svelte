<script lang="ts">
import type { Currency, NumericalTool, AcceptableFormulaOutputFormat } from "+/entity"
import type { NumericalToolConclusion, AcceptableConstellationKind, Constellation } from "+/rest"

import { ACCEPTABLE_CONSTELLATION_KINDS, ACCOUNT_CONSTELLATION_KIND } from "#/rest"

import formatStar from "$/utility/format_star"
import formatPercentage from "$/utility/format_percentage"

import UnitDataTable from "$/catalog/unit_data_table.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"
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
$: constellationCountAndSums = reducedConstellations.reduce((groups, constellation) => ({
	...groups,
	[constellation.kind]: typeof groups[constellation.kind] === "undefined"
		? constellation.stars.map(star => [ 1, star.numerical_value ])
		: groups[constellation.kind].map((sum, i) => [
			sum[0] + 1,
			sum[1] + constellation.stars[i].numerical_value
		])
}), {} as Record<AcceptableConstellationKind, ([number, number])[]>)
</script>

<GridCell kind="pair">
	<article class="card">
		<div class="card-content">
			<Flex mustPad={false} justifyContent="center">
				<WeakenedTertiaryHeading>
					{numericalTool.name}
				</WeakenedTertiaryHeading>
				<UnitDataTable>
					<svelte:fragment slot="table_headers">
						<DataTableHeader scope="column">Name</DataTableHeader>
						{#each timeTags as timeTag}
							<DataTableHeader scope="column">{timeTag}</DataTableHeader>
						{/each}
					</svelte:fragment>
					<svelte:fragment slot="table_rows">
						{#each reducedConstellations as constellation}
							<DataTableRow>
								<DataTableHeader scope="row">{constellation.name}</DataTableHeader>
								{#each constellation.stars as star, i}
									<DataTableCell>
										{formatStar(outputFormat, currency, star)}

										{#if constellation.kind === ACCOUNT_CONSTELLATION_KIND}
											({ formatPercentage(
												star.numerical_value,
												constellationCountAndSums[constellation.kind][i][1],
												2
											) })
										{:else if constellationCountAndSums[constellation.kind][i][0] > 1}
											({ formatPercentage(
												star.numerical_value,
												constellationCountAndSums[constellation.kind][i][1],
												2
											) })
										{/if}
									</DataTableCell>
								{/each}
							</DataTableRow>
						{/each}
					</svelte:fragment>
				</UnitDataTable>
				<ShortParagraph>
					The table above shows the data from {timeTags[0]}{#if hasMultipleTimes}&nbsp; to {timeTags[timeTagCount - 1]}{/if}.
				</ShortParagraph>
			</Flex>
		</div>
	</article>
</GridCell>

<style lang="scss">
@use "@/components/third-party/index";

:global(.line) {
	grid-row: span 3;
}
</style>
