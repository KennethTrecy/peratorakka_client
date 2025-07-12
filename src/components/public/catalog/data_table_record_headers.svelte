<script lang="ts">
import type { Snippet } from "svelte"

import DataTableHeader from "$/catalog/data_table_header.svelte"

let {
	mainCellLabel = "Name",
	actionCellLabel = "Actions",
	leading_headers,
	trailing_headers
}: {
	mainCellLabel?: string
	actionCellLabel?: string
	leading_headers?: Snippet
	trailing_headers?: Snippet
} = $props()
</script>

{@render leading_headers?.()}
<DataTableHeader scope="column">{mainCellLabel}</DataTableHeader>
{@render trailing_headers?.()}
<DataTableHeader scope="column">{actionCellLabel}</DataTableHeader>
