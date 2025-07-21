<script lang="ts">
import type { Snippet } from "svelte"

import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import InteractiveContainer from "$/layout/interactive_container.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import SecondaryHeading from "$/typography/secondary_heading.svelte"
import TextContainer from "$/typography/text_container.svelte"

let {
	individualName,
	mayShowForm,
	isLoadingInitialData = false,
	description,
	form,
	requirement
}: {
	individualName: string
	mayShowForm: boolean
	isLoadingInitialData?: boolean
	description: Snippet
	form: Snippet
	requirement?: Snippet
} = $props()
</script>

<GridCell kind="full">
	<SecondaryHeading>Add {individualName}</SecondaryHeading>
</GridCell>
<GridCell kind="full">
	<InteractiveContainer>
		{#snippet text()}
			{@render description()}
		{/snippet}
		{#snippet widget()}
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
				{@render form()}
			{:else}
				{@render requirement?.()}
			{/if}
		{/snippet}
	</InteractiveContainer>
</GridCell>
