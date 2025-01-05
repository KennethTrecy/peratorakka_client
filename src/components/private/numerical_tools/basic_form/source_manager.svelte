<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Collection, Currency, Formula, AcceptableSource } from "+/entity"

import ShortParagraph from "$/typography/short_paragraph.svelte"
import SourceContainer from "%/numerical_tools/basic_form/source_container.svelte"

export let IDPrefix: string
export let formulae: Formula[]
export let currencies: Currency[]
export let collections: Collection[]

export let sources: AcceptableSource[]

export let isConnecting: boolean
export let errors: GeneralError[]

function removeSource(event: CustomEvent<number>) {
	const index = event.detail

	sources = sources.filter((_, i) => i !== index)
}

function moveSourceUp(event: CustomEvent<number>) {
	const index = event.detail

	const newSources = [ ...sources ]
	const currentSource = newSources[index]

	newSources[index] = newSources[index - 1]
	newSources[index - 1] = currentSource

	sources = newSources
}

function moveSourceDown(event: CustomEvent<number>) {
	const index = event.detail

	const newSources = [ ...sources ]
	const currentSource = newSources[index]

	newSources[index] = newSources[index + 1]
	newSources[index + 1] = currentSource

	sources = newSources
}

$: sourceCount = sources.length
</script>

{#if sourceCount === 0}
	<ShortParagraph>
		Add source of data to be shown first.
	</ShortParagraph>
{/if}

{#each sources as source, index}
	<SourceContainer
		{isConnecting}
		index={index}
		maxIndex={sourceCount - 1}
		bind:source={source}
		{formulae}
		{currencies}
		{collections}
		IDPrefix={`${IDPrefix}_${index}`}
		{errors}
		on:remove={removeSource}
		on:up={moveSourceUp}
		on:down={moveSourceDown}/>
{/each}
