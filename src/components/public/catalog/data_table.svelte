<script lang="ts">
	import CatalogBase from "$/catalog/base.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]
</script>

<CatalogBase
	{isConnecting}
	{collectiveName}
	{data}>
	<SecondaryHeading slot="name">Available {collectiveName}</SecondaryHeading>
	<slot slot="filled_collection_description" name="filled_collection_description"/>
	<slot slot="empty_collection_description" name="empty_collection_description"/>
	<GridCell slot="available_content" kind="full">
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
</CatalogBase>
