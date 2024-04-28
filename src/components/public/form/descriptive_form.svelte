<script lang="ts">
	import InteractiveContainer from "$/layout/interactive_container.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import IndeterminateProgressBar from "$/utility/indeterminate_progress_bar.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
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
		<div slot="widget">
			<IndeterminateProgressBar
				isLoading={isLoadingInitialData}
				progressBarLabel="Waiting for server's response..."/>
			{#if isLoadingInitialData}
				<Flex direction="column" mustPad={false}>
					<TextContainer>
						<ShortParagraph>
							Initial data for the form is loading...
						</ShortParagraph>
					</TextContainer>
				</Flex>
			{:else if mayShowForm}
				<slot name="form"/>
			{:else}
				<slot name="requirement"/>
			{/if}
		</div>
	</InteractiveContainer>
</GridCell>
