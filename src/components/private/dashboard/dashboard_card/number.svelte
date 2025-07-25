<script lang="ts">
import type { Writable } from "svelte/store"
import type { PrecisionFormat, Currency, Formula, NumericalToolConfiguration } from "+/entity"
import type { GeneralError, NumericalToolConclusion } from "+/rest"

import { CURRENCY_FORMULA_OUTPUT_FORMAT } from "#/entity"

import { fallbackToAcceptableFormulaOutputFormat } from "+/entity"
import formatStar from "$/utility/format_star"

import BaseCard from "%/dashboard/dashboard_card/base.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"
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
let constellations = $derived(conclusion.constellations)
let hasMultipleTimes = $derived(timeTags.length > 1)
let reducedConstellations = $derived(constellations.filter(
	constellation => constellation.stars.some(star => star.numerical_value !== 0)
))
</script>

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
	<BaseCard
		kind={constellation.stars.length === 1 ? "hextet" : "narrow"}
		rowSpan={
			constellation.stars.length === 1
				? 1 * 2
				: Math.max(3, Math.ceil(constellation.stars.length / 1.5)) * 2 - 1
		}
		name={formatStar(
			outputFormat,
			precisionFormat,
			currency,
			constellation.stars[constellation.stars.length - 1]
		)}
		{referenceDate}
		{IDPrefix}
		{formID}
		{isConnecting}
		{errors}
		{view}
		{refresh}>
		{#snippet resource_info()}
			<ShortParagraph>
				{name} for {timeTags[constellation.stars.length - 1]}. {#if hasMultipleTimes}Previous values can be seen below.{/if}
			</ShortParagraph>
			{#if hasMultipleTimes}
				<UnitDataTable>
					{#snippet table_headers()}
						<DataTableHeader scope="column">Cycle</DataTableHeader>
						<DataTableHeader scope="column">Amount</DataTableHeader>
					{/snippet}
					{#snippet table_rows()}
						{#each constellation.stars as star, i}
							{#if i < constellation.stars.length - 1}
								<DataTableRow>
									<DataTableHeader scope="row">{timeTags[i]}</DataTableHeader>
									<DataTableCell>
										{formatStar(
											outputFormat,
											precisionFormat,
											currency,
											star
										)}
									</DataTableCell>
								</DataTableRow>
							{/if}
						{/each}
					{/snippet}
				</UnitDataTable>
			{/if}
		{/snippet}
	</BaseCard>
{/each}
