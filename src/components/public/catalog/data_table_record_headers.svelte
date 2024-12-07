<script lang="ts">
import DataTableHeader from "$/catalog/data_table_header.svelte"

export let mainCellLabel = "Name"
export let actionCellLabel = "Actions"
</script>

<slot name="leading_headers"/>
<DataTableHeader scope="column">{mainCellLabel}</DataTableHeader>
<slot name="trailing_headers"/>
<DataTableHeader scope="column">{actionCellLabel}</DataTableHeader>
