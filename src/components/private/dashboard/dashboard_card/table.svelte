<script lang="ts">
import type { Writable } from "svelte/store"
import type { PrecisionFormat, Currency, Formula, NumericalToolConfiguration } from "+/entity"
import type { GeneralError, NumericalToolConclusion, AcceptableConstellationKind } from "+/rest"
import type { GridCellKind } from "+/component"

import { ACCOUNT_CONSTELLATION_KIND } from "#/rest"
import { CURRENCY_FORMULA_OUTPUT_FORMAT } from "#/entity"

import { fallbackToAcceptableFormulaOutputFormat } from "+/entity"
import formatStar from "$/utility/format_star"
import formatPercentage from "$/utility/format_percentage"

import BaseCard from "%/dashboard/dashboard_card/base.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"
import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

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
let constellationCountAndSums = $derived(reducedConstellations.reduce((groups, constellation) => ({
	...groups,
	[constellation.kind]: typeof groups[constellation.kind] === "undefined"
		? constellation.stars.map(star => [ 1, star.numerical_value ])
		: groups[constellation.kind].map((sum, i) => [
			sum[0] + 1,
			sum[1] + constellation.stars[i].numerical_value,
		])
}), {} as Record<AcceptableConstellationKind, ([ number, number ])[]>))

let kind = $derived((
	timeTags.length === 1
		? "pair"
		: timeTags.length < 4
			? "almost_full"
			: "full"
) as GridCellKind)
let rowSpan = $derived(Math.floor(reducedConstellations.length / 2.25) * 2)
</script>

<BaseCard
	{kind}
	{rowSpan}
	{name}
	{referenceDate}
	{IDPrefix}
	{formID}
	{isConnecting}
	{errors}
	{view}
	{refresh}>
	{#snippet resource_info()}
		<Flex mustPad={false}>
			<UnitDataTable>
				{#snippet table_headers()}
					<DataTableHeader scope="column">Name</DataTableHeader>
					{#each timeTags as timeTag}
						<DataTableHeader scope="column" kind="numeric">{timeTag}</DataTableHeader>
					{/each}
				{/snippet}
				{#snippet table_rows()}
					{#each reducedConstellations as constellation}
						{@const constellationName = constellation.name}
						{@const foundFormula = formulae.find(formula => formula.name === constellationName)}
						{@const isFormulaKnownAsSource = configuration.sources.some(
							source =>
								source.type === "formula"
								&& source.formula_id === foundFormula?.id
						)}
						{@const outputFormat = isFormulaKnownAsSource
							? fallbackToAcceptableFormulaOutputFormat(
								foundFormula?.output_format ?? CURRENCY_FORMULA_OUTPUT_FORMAT
							) : CURRENCY_FORMULA_OUTPUT_FORMAT}
						{@const precisionFormat = isFormulaKnownAsSource
							? precisionFormats.find(precisionFormat => {
								return precisionFormat.id === foundFormula?.precision_format_id
							}) ?? currencyPrecisionFormat
							: currencyPrecisionFormat}
						<DataTableRow>
							<DataTableHeader scope="row">{constellation.name}</DataTableHeader>
							{#each constellation.stars as star, i}
								<DataTableCell kind="numeric">
									{formatStar(outputFormat, precisionFormat, currency, star)}

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
				{/snippet}
			</UnitDataTable>
			<ShortParagraph>
				The table above shows the data from {timeTags[0]}{#if hasMultipleTimes}&nbsp; to {timeTags[timeTagCount - 1]}{/if}.
			</ShortParagraph>
		</Flex>
	{/snippet}
</BaseCard>
