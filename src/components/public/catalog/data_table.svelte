<script lang="ts">
	import UnnamedDataTable from "$/catalog/unnamed_data_table.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]
</script>

<UnnamedDataTable
	{isConnecting}
	{collectiveName}
	{data}>
	<SecondaryHeading slot="name">Available {collectiveName}</SecondaryHeading>
	<slot slot="filled_collection_description" name="filled_collection_description"/>
	<slot slot="table_headers" name="table_headers"/>
	<slot slot="table_rows" name="table_rows"/>
	<slot slot="empty_collection_description" name="empty_collection_description"/>
</UnnamedDataTable>
