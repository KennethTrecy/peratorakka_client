<script lang="ts">
	import DataTableCell from "$/catalog/data_table_cell.svelte"
</script>

<DataTableCell scope="column">Name</DataTableCell>
<DataTableCell scope="column">Debit Account</DataTableCell>
<DataTableCell scope="column">Credit Account</DataTableCell>
<slot/>
<DataTableCell scope="column">Actions</DataTableCell>
