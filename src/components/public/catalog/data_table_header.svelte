<script lang="ts">
import type { DataTableCellKind, DataTableCellScope, DataTableCellStatus } from "+/component"

export let kind: DataTableCellKind = "normal"
export let status: DataTableCellStatus = "present"
export let scope: DataTableCellScope = "row"
export let columnSpan: number = 1
export let rowSpan: number = 1

$: headerClasses = [
	kind === "numeric" ? "cell--numeric" : false,
	kind === "descriptive" ? "cell--descriptive" : false,
	kind === "representative" ? "cell--representative" : false,
	status === "archived" ? "cell--archived" : false
].filter(Boolean).join(" ")
$: resolvedScope = scope === "column" ? "col" : "row"
$: role = scope === "column" ? "columnheader" : null

let element: HTMLElement
$: title = element?.innerHTML ?? "Loading..."
</script>

<th
	class={headerClasses}
	{role}
	scope={resolvedScope}
	colspan={columnSpan}
	rowspan={rowSpan}
	{title}
	bind:this={element}>
	<slot/>
</th>

<style lang="scss">
@use "@/components/third-party/index";

.cell--numeric {
	text-align: right;
}

.cell--representative {
	max-width: 20ch;
	overflow: visible;
	text-overflow: ellipsis;
	white-space: normal;
}

.cell--descriptive {
	max-width: 70ch;
	overflow: visible;
	text-overflow: initial;
	white-space: normal;
	text-align: justify;
}

.cell--archived {
	text-decoration: line-through;
}
</style>
