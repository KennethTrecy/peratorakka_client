<script lang="ts">
import type { Snippet } from "svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import TextContainer from "$/typography/text_container.svelte"

let {
	isConnecting,
	progressRate,
	collectiveName,
	data,
	name,
	bare_list_specifier,
	list_specifier,
	filled_collection_description,
	available_content,
	empty_collection_description
}: {
	isConnecting: boolean
	progressRate: number
	collectiveName: string
	data: unknown[]
	name: Snippet
	bare_list_specifier?: Snippet
	list_specifier?: Snippet
	filled_collection_description: Snippet
	available_content: Snippet
	empty_collection_description: Snippet
} = $props()

let hasData = $derived(data.length > 0)
let progressBarLabel = $derived(isConnecting
	? `Loading ${collectiveName.toLocaleLowerCase()}...`
	: `Finished attempt on loading ${collectiveName.toLocaleLowerCase()}.`)
</script>

<GridCell kind="full">
	{@render name()}
</GridCell>
{#if isConnecting}
	<GridCell kind="full">
		<Flex direction="column" justifyContent="center" mustPad={false}>
			<TextContainer>
				<ElementalParagraph alignment="center">
					Please wait while the client request the list from the server.
				</ElementalParagraph>
			</TextContainer>
		</Flex>
	</GridCell>
{:else}
	{@render bare_list_specifier?.()}
	{#if list_specifier}
		<GridCell kind="full">
			<Flex direction="row" justifyContent="responsive_stretch" mustPad={false}>
				{@render list_specifier?.()}
			</Flex>
		</GridCell>
	{/if}
	{#if hasData}
		<GridCell kind="full">
			<Flex direction="column" mustPad={false}>
				<TextContainer>
					<ElementalParagraph>
						{@render filled_collection_description()}
					</ElementalParagraph>
				</TextContainer>
			</Flex>
		</GridCell>
		{@render available_content()}
	{:else}
		<GridCell kind="full">
			<Flex direction="column" mustPad={false}>
				<TextContainer>
					<ElementalParagraph alignment="center">
						{@render empty_collection_description()}
					</ElementalParagraph>
				</TextContainer>
			</Flex>
		</GridCell>
	{/if}
{/if}
<GridCell kind="full">
	<ReactiveProgressBar
		isLoading={isConnecting}
		{progressRate}
		{progressBarLabel}/>
</GridCell>
