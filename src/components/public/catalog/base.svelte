<script lang="ts">
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import IndeterminateProgressBar from "$/utility/indeterminate_progress_bar.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]

	$: hasData = data.length > 0
	$: progressBarLabel = isConnecting
		? `Loading ${collectiveName.toLocaleLowerCase()}...`
		: `Finished attempt on loading ${collectiveName.toLocaleLowerCase()}.`
</script>

<GridCell kind="full">
	<IndeterminateProgressBar
		isLoading={isConnecting}
		{progressBarLabel}/>
	<slot name="name"/>
</GridCell>

{#if isConnecting}
	<GridCell kind="full">
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
	<slot name="available_content"/>
{:else}
	<GridCell kind="full">
		<ElementalParagraph>
			<slot name="empty_collection_description"/>
		</ElementalParagraph>
	</GridCell>
{/if}
