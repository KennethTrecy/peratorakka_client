<script lang="ts">
import type { DataTableCellKind, DataTableCellStatus } from "+/component"

export let kind: DataTableCellKind = "normal"
export let status: DataTableCellStatus = "present"
export let columnSpan: number = 1
export let rowSpan: number = 1

$: rowClasses = [,
	kind === "numeric" ? "cell--numeric" : false,
	kind === "descriptive" ? "cell--descriptive" : false,
	kind === "representative" ? "cell--representative" : false,
	status === "archived" ? "cell--archived" : false
].filter(Boolean).join(" ")
</script>

<td class={rowClasses} colspan={columnSpan} rowspan={rowSpan}>
	<slot/>
</td>

<style lang="scss">
@use "@/components/third-party/index";

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
