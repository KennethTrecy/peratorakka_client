<script lang="ts">
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import IndeterminateProgressBar from "$/utility/indeterminate_progress_bar.svelte"
	import TextContainer from "$/typography/text_container.svelte"

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
		<Flex direction="column" mustPad={false}>
			<TextContainer>
				<ElementalParagraph>
					Please wait while the client request the list from the server.
				</ElementalParagraph>
			</TextContainer>
		</Flex>
	</GridCell>
{:else if hasData}
	<GridCell kind="full">
		<Flex direction="column" mustPad={false}>
			<TextContainer>
				<ElementalParagraph>
					<slot name="filled_collection_description"></slot>
				</ElementalParagraph>
			</TextContainer>
		</Flex>
	</GridCell>
	<slot name="bare_list_specifier"/>
	{#if $$slots.list_specifier}
		<GridCell kind="full">
			<Flex direction="row" justifyContent="responsive_stretch" mustPad={false}>
				<slot name="list_specifier"/>
			</Flex>
		</GridCell>
	{/if}
	<slot name="available_content"/>
{:else}
	<GridCell kind="full">
		<Flex direction="column" mustPad={false}>
			<TextContainer>
				<ElementalParagraph>
					<slot name="empty_collection_description"/>
				</ElementalParagraph>
			</TextContainer>
		</Flex>
	</GridCell>
	<slot name="bare_list_specifier"/>
	{#if $$slots.list_specifier}
		<GridCell kind="full">
			<slot name="list_specifier"/>
		</GridCell>
	{/if}
{/if}
