<script lang="ts">
	import type { GridCellKind } from "+/component"

	import GridCell from "$/layout/grid_cell.svelte"
	import IndeterminateProgressBar from "$/utility/indeterminate_progress_bar.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	export let individualName: string
	export let mayShowForm: boolean
	export let isLoadingInitialData: boolean = false
	export let descriptionSize: GridCellKind = "majority"
	export let formSize: GridCellKind = "minority"
</script>

<GridCell kind="full">
	<SecondaryHeading>Add {individualName}</SecondaryHeading>
</GridCell>
<GridCell kind={descriptionSize}>
	<slot name="description"></slot>
</GridCell>
<GridCell kind={formSize}>
	<IndeterminateProgressBar
		isLoading={isLoadingInitialData}
		progressBarLabel="Waiting for server's response..."/>
	{#if isLoadingInitialData}
		<TextContainer>
			<ShortParagraph>
				Initial data for the form is loading...
			</ShortParagraph>
		</TextContainer>
	{:else if mayShowForm}
		<slot name="form"></slot>
	{:else}
		<slot name="requirement"></slot>
	{/if}
</GridCell>
