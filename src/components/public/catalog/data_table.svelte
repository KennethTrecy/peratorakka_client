<script lang="ts">
	import CatalogBase from "$/catalog/base.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]
</script>

<CatalogBase
	{isConnecting}
	{collectiveName}
	{data}>
	<SecondaryHeading slot="name">Available {collectiveName}</SecondaryHeading>
	<Flex slot="filled_collection_description" direction="column" mustPad={false}>
		<TextContainer>
			<slot name="filled_collection_description"/>
		</TextContainer>
	</Flex>
	<Flex slot="empty_collection_description" direction="column" mustPad={false}>
		<TextContainer>
			<slot name="empty_collection_description"/>
		</TextContainer>
	</Flex>
	<GridCell slot="available_content" kind="full">
		<Flex direction="column" mustPad={false}>
			<UnitDataTable>
				<slot slot="table_headers" name="table_headers"/>
				<slot slot="table_rows" name="table_rows"/>
				{#if $$slots.table_footer_cells}
					<slot name="table_footer_cells"/>
				{/if}
			</UnitDataTable>
		</Flex>
	</GridCell>
</CatalogBase>
