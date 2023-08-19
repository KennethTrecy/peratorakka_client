<script lang="ts">
	import CurrencyCard from "%/currencies/currency_card.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]

	$: hasData = data.length > 0
</script>

<GridCell kind="full">
	<SecondaryHeading>Available {collectiveName}</SecondaryHeading>
</GridCell>

{#if isConnecting}
	<GridCell kind="full">
		<span class="loader large margin" role="progressbar"></span>
		<ElementalParagraph>
			Please wait while the client request the list from the server.
		</ElementalParagraph>
	</GridCell>
{:else if hasData}
	<GridCell kind="full">
		<ElementalParagraph>
			<slot name="filled_collection_description"></slot>
		</ElementalParagraph>
	</GridCell>
	<slot name="cards"></slot>
{:else}
	<GridCell kind="full">
		<ElementalParagraph>
			<slot name="empty_collection_description"></slot>
		</ElementalParagraph>
	</GridCell>
{/if}

<style lang="scss">
</style>
