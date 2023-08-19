<script lang="ts">
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import IndeterminateProgressBar from "$/utility/indeterminate_progress_bar.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]

	$: hasData = data.length > 0
	$: progressBarLabel = isConnecting
		? `Loading ${collectiveName.toLocaleLowerCase()}...`
		: `Finished attempt on loading ${collectiveName.toLocaleLowerCase()}.`
</script>

<GridCell kind="full">
	<SecondaryHeading>Available {collectiveName}</SecondaryHeading>
</GridCell>
<GridCell kind="full">
	<IndeterminateProgressBar
		isLoading={isConnecting}
		{progressBarLabel}/>
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
	<slot name="cards"></slot>
{:else}
	<GridCell kind="full">
		<ElementalParagraph>
			<slot name="empty_collection_description"></slot>
		</ElementalParagraph>
	</GridCell>
{/if}

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/linear-progress";

	@include linear-progress.core-styles;
</style>
