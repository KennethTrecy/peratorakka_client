<script lang="ts">
	import DataTableHeader from "$/catalog/data_table_header.svelte"
</script>

<slot name="leading_headers"/>
<DataTableHeader scope="column">Name</DataTableHeader>
<DataTableHeader scope="column">Debit/Credit</DataTableHeader>
<slot name="trailing_headers"/>
<DataTableHeader scope="column">Actions</DataTableHeader>
