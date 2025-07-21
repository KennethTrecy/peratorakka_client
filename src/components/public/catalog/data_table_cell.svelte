<script lang="ts">
import type { Snippet } from "svelte"
import type { DataTableCellKind, DataTableCellStatus } from "+/component"

let {
	kind = "normal",
	status = "present",
	columnSpan = 1,
	rowSpan = 1,
	children
}: {
	kind?: DataTableCellKind
	status?: DataTableCellStatus
	columnSpan?: number
	rowSpan?: number
	children?: Snippet
} = $props()

let rowClasses = $derived([,
	kind === "numeric" ? "cell--numeric" : false,
	kind === "descriptive" ? "cell--descriptive" : false,
	kind === "representative" ? "cell--representative" : false,
	status === "archived" ? "cell--archived" : false
].filter(Boolean).join(" "))
</script>

<td class={rowClasses} colspan={columnSpan} rowspan={rowSpan}>
	{@render children?.()}
</td>

<style lang="scss">
.cell--numeric {
	text-align: right;
	white-space: nowrap;
}

.cell--representative {
	max-width: 20ch;
	overflow: visible;
	text-overflow: initial;
	white-space: normal;
	text-align: justify;
}

.cell--descriptive {
	max-width: 30ch;
	overflow: visible;
	text-overflow: initial;
	white-space: normal;
	text-align: justify;
}

.cell--archived {
	text-decoration: line-through;
}
</style>
