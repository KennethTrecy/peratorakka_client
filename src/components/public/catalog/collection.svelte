<script lang="ts">
import type { Snippet } from "svelte"
import CatalogBase from "$/catalog/base.svelte"
import SecondaryHeading from "$/typography/secondary_heading.svelte"

let {
	isConnecting,
	progressRate,
	collectiveName,
	data,
	list_specifier,
	filled_collection_description,
	empty_collection_description,
	cards
}: {
	isConnecting: boolean
	progressRate: number
	collectiveName: string
	data: unknown[];
	list_specifier?: Snippet
	filled_collection_description: Snippet
	empty_collection_description: Snippet
	cards: Snippet
} = $props()
</script>

<CatalogBase
	{isConnecting}
	{progressRate}
	{collectiveName}
	{data}
	{list_specifier}
	{filled_collection_description}
	{empty_collection_description}
	available_content={cards}>
	{#snippet name()}
		<SecondaryHeading>Available {collectiveName}</SecondaryHeading>
	{/snippet}
</CatalogBase>
