<script lang="ts">
import type {
	PrecisionFormat,
	Currency,
	Formula,
	NumericalTool,
	NumericalToolConfiguration
} from "+/entity"
import type { NumericalToolConclusion } from "+/rest"

import debounce from "lodash.debounce"
import { writable } from "svelte/store"

import { UNKNOWN_CURRENCY } from "#/component"
import {
	NUMBER_NUMERICAL_TOOL_KIND,
	PIE_NUMERICAL_TOOL_KIND,
	LINE_NUMERICAL_TOOL_KIND,
	TABLE_NUMERICAL_TOOL_KIND
} from "#/entity"

import makeJSONRequester from "$/rest/make_json_requester"
import makeDateFieldValue from "$/utility/make_date_field_value"

import GridCell from "$/layout/grid_cell.svelte"
import LineVisualizer from "%/dashboard/dashboard_card/line.svelte"
import NumberVisualizer from "%/dashboard/dashboard_card/number.svelte"
import PieVisualizer from "%/dashboard/dashboard_card/pie.svelte"
import TableVisualizer from "%/dashboard/dashboard_card/table.svelte"

let {
	data,
	formulae,
	currencies,
	precisionFormats,
	workingIndex,
	assignedIndex,
	finish,
	skip
}: {
	data: NumericalTool
	formulae: Formula[]
	currencies: Currency[]
	precisionFormats: PrecisionFormat[]
	workingIndex: number
	assignedIndex: number
	finish: () => void
	skip: () => void
} = $props()

let referenceDate = $state(makeDateFieldValue(new Date()))

let IDPrefix = $derived(`old_numerical_tool_${data.id}`)
let formID = $derived(`${IDPrefix}_time_travel_form`)

let conclusion = $state<NumericalToolConclusion|null>(null)
const completeCalculationPath = writable(`/api/v2/numerical_tools/calculate/${data.id}`)

const { isConnecting, errors, send } = makeJSONRequester({
	"path": completeCalculationPath,
	"defaultRequestConfiguration": {
		"method": "GET"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 200,
			"action": async (response: Response) => {
				const responseDocument = await response.json()

				conclusion = responseDocument["@meta"] as NumericalToolConclusion
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

let abortController: AbortController|null = null
const loadConclusionsFully = debounce(() => loadConclusions(), 1000)
async function loadConclusions() {
	if (conclusion === null) {
		completeCalculationPath.set(
			`/api/v2/numerical_tools/calculate/${data.id}?reference_date=${referenceDate}`
		)
	} else {
		return
	}

	if (abortController !== null) abortController.abort()

	abortController = new AbortController()

	await send({
		"signal": abortController.signal
	})

	if (conclusion === null) {
		skip()
	} else {
		finish()
	}
}

$effect(() => {
	if (workingIndex === assignedIndex) {
		loadConclusionsFully()
	}
})

let configuration = $derived(JSON.parse(data.configuration) as NumericalToolConfiguration)
let associatedCurrency = $derived(currencies.find(
	currency => currency.id === data.currency_id
) ?? UNKNOWN_CURRENCY)
let associatedCurrencyPrecisionFormat = $derived(precisionFormats.find(
	precisionFormat => precisionFormat.id === associatedCurrency.precision_format_id
) ?? null)

async function view(newReferenceDate: string): Promise<void> {
	referenceDate = newReferenceDate
	await refresh()
}

async function refresh() {
	conclusion = null
	await loadConclusions()
}
</script>

{#if conclusion === null}
	<GridCell kind="hextet" rowSpan={1}>
		<p>Loading...</p>
	</GridCell>
{:else}
	{#if data.kind === NUMBER_NUMERICAL_TOOL_KIND}
		<NumberVisualizer
			currencyPrecisionFormat={associatedCurrencyPrecisionFormat}
			currency={associatedCurrency}
			{formulae}
			{precisionFormats}
			name={data.name}
			{configuration}
			{referenceDate}
			{conclusion}
			{IDPrefix}
			{formID}
			{isConnecting}
			{errors}
			{view}
			{refresh}/>
	{:else if data.kind === PIE_NUMERICAL_TOOL_KIND}
		<PieVisualizer
			currencyPrecisionFormat={associatedCurrencyPrecisionFormat}
			currency={associatedCurrency}
			{formulae}
			{precisionFormats}
			name={data.name}
			{configuration}
			{referenceDate}
			{conclusion}
			{IDPrefix}
			{formID}
			{isConnecting}
			{errors}
			{view}
			{refresh}/>
	{:else if data.kind === LINE_NUMERICAL_TOOL_KIND}
		<LineVisualizer
			currencyPrecisionFormat={associatedCurrencyPrecisionFormat}
			currency={associatedCurrency}
			{formulae}
			{precisionFormats}
			name={data.name}
			{configuration}
			{referenceDate}
			{conclusion}
			{IDPrefix}
			{formID}
			{isConnecting}
			{errors}
			{view}
			{refresh}/>
	{:else if data.kind === TABLE_NUMERICAL_TOOL_KIND}
		<TableVisualizer
			currencyPrecisionFormat={associatedCurrencyPrecisionFormat}
			currency={associatedCurrency}
			{formulae}
			{precisionFormats}
			name={data.name}
			{configuration}
			{referenceDate}
			{conclusion}
			{IDPrefix}
			{formID}
			{isConnecting}
			{errors}
			{view}
			{refresh}/>
	{/if}
{/if}
