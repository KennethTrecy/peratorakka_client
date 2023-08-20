<script lang="ts">
	import DataTableHeader from "$/catalog/data_table_header.svelte"
</script>

<DataTableHeader scope="column">Name</DataTableHeader>
<DataTableHeader scope="column">Debit Account</DataTableHeader>
<DataTableHeader scope="column">Credit Account</DataTableHeader>
<slot/>
<DataTableHeader scope="column">Actions</DataTableHeader>
