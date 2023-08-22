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
	<IndeterminateProgressBar
		isLoading={isConnecting}
		{progressBarLabel}/>
	<SecondaryHeading>Available {collectiveName}</SecondaryHeading>
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
	<GridCell kind="full">
		<div class="mdc-data-table">
			<div class="mdc-data-table__table-container">
				<table class="mdc-data-table__table" aria-label="Dessert calories">
					<thead>
						<tr class="mdc-data-table__header-row">
							<slot name="table_headers"/>
						</tr>
					</thead>
					<tbody class="mdc-data-table__content">
						<slot name="table_rows"/>
					</tbody>
				</table>
			</div>
		</div>
	</GridCell>
{:else}
	<GridCell kind="full">
		<ElementalParagraph>
			<slot name="empty_collection_description"></slot>
		</ElementalParagraph>
	</GridCell>
{/if}

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;

	.mdc-data-table {
		max-width: 100%;
		overflow-x: scroll;
	}
</style>
