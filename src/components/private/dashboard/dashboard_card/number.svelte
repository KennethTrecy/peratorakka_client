<script lang="ts">
import type { Currency, NumericalTool, AcceptableFormulaOutputFormat } from "+/entity"
import type { NumericalToolConclusion } from "+/rest"

import formatStar from "$/utility/format_star"

import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"
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
	<GridCell
		kind={constellation.stars.length === 1 ? "hextet" : "narrow"}
		rowSpan={
			constellation.stars.length === 1
				? 2
				: 1 + Math.floor(constellation.stars.length / 2)
		}>
		<article class="card">
			<div class="card-content">
				<Flex mustPad={false}>
					<WeakenedTertiaryHeading>
						{formatStar(
							outputFormat,
							currency,
							constellation.stars[constellation.stars.length - 1]
						)}
					</WeakenedTertiaryHeading>
					<ShortParagraph>
						{constellation.name} for {timeTags[constellation.stars.length - 1]}. This card follows instructions from numerical tool named "{numericalTool.name}". {#if hasMultipleTimes}Previous values can be seen below.{/if}
					</ShortParagraph>
					{#if hasMultipleTimes}
						<UnitDataTable>
							<svelte:fragment slot="table_headers">
								<DataTableHeader scope="column">Cycle</DataTableHeader>
								<DataTableHeader scope="column">Amount</DataTableHeader>
							</svelte:fragment>
							<svelte:fragment slot="table_rows">
								{#each constellation.stars as star, i}
									{#if i < constellation.stars.length - 1}
										<DataTableRow>
											<DataTableHeader scope="row">{timeTags[i]}</DataTableHeader>
											<DataTableCell>
												{formatStar(
													outputFormat,
													currency,
													constellation.stars[i]
												)}
											</DataTableCell>
										</DataTableRow>
									{/if}
								{/each}
							</svelte:fragment>
						</UnitDataTable>
					{/if}
				</Flex>
			</div>
		</article>
	</GridCell>
{/each}


<style lang="scss">
@use "@/components/third-party/index";
.card {
	height: 100%;
}
</style>
