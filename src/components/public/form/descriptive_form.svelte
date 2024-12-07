<script lang="ts">
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import InteractiveContainer from "$/layout/interactive_container.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import SecondaryHeading from "$/typography/secondary_heading.svelte"
import TextContainer from "$/typography/text_container.svelte"

export let individualName: string
export let mayShowForm: boolean
export let isLoadingInitialData: boolean = false
</script>

<GridCell kind="full">
	<SecondaryHeading>Add {individualName}</SecondaryHeading>
</GridCell>
<GridCell kind="full">
	<InteractiveContainer>
		<slot slot="text" name="description"/>
		<svelte:fragment slot="widget">
			<ReactiveProgressBar
				isLoading={isLoadingInitialData}
				progressBarLabel="Waiting for server's response..."/>
			{#if isLoadingInitialData}
				<Flex direction="column" mustPad={false}>
					<TextContainer>
						<ElementalParagraph alignment="center">
							Initial data for the form is loading...
						</ElementalParagraph>
					</TextContainer>
				</Flex>
			{:else if mayShowForm}
				<slot name="form"/>
			{:else}
				<slot name="requirement"/>
			{/if}
		</svelte:fragment>
	</InteractiveContainer>
</GridCell>
