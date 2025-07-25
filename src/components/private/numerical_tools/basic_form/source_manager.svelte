<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Collection, Currency, Formula, AcceptableSource } from "+/entity"

import ShortParagraph from "$/typography/short_paragraph.svelte"
import SourceContainer from "%/numerical_tools/basic_form/source_container.svelte"

let {
	IDPrefix,
	formulae,
	collections,
	sources = $bindable(),
	isConnecting,
	errors
}: {
	IDPrefix: string
	formulae: Formula[]
	collections: Collection[]
	sources: AcceptableSource[]
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

function removeSource(index: number): void {
	sources = sources.filter((_, i) => i !== index)
}

function moveSourceUp(index: number): void {
	const newSources = [ ...sources ]
	const currentSource = newSources[index]

	newSources[index] = newSources[index - 1]
	newSources[index - 1] = currentSource

	sources = newSources
}

function moveSourceDown(index: number): void {
	const newSources = [ ...sources ]
	const currentSource = newSources[index]

	newSources[index] = newSources[index + 1]
	newSources[index + 1] = currentSource

	sources = newSources
}

let sourceCount = $derived(sources.length)
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
		bind:source={() => source, source => sources[index] = source}
		{formulae}
		{collections}
		IDPrefix={`${IDPrefix}_${index}`}
		{errors}
		remove={removeSource}
		up={moveSourceUp}
		down={moveSourceDown}/>
{/each}
