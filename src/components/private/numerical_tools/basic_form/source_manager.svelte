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
</script>

{#if sources.length === 0}
	<ShortParagraph>
		Add source of data to be shown first.
	</ShortParagraph>
{/if}

{#each sources as source, index}
	<SourceContainer
		{isConnecting}
		bind:source={source}
		{formulae}
		{currencies}
		{collections}
		IDPrefix={`${IDPrefix}_${index}`}
		{errors}/>
{/each}
