<script lang="ts">
import type { Snippet } from "svelte"
import type { DataTableCellKind, DataTableCellScope, DataTableCellStatus } from "+/component"

let {
	kind = "normal",
	status = "present",
	scope = "row",
	columnSpan = 1,
	rowSpan = 1,
	children
}: {
	kind?: DataTableCellKind
	status?: DataTableCellStatus
	scope?: DataTableCellScope
	columnSpan?: number
	rowSpan?: number
	children: Snippet
} = $props()

let headerClasses = $derived([
	kind === "numeric" ? "cell--numeric" : false,
	kind === "descriptive" ? "cell--descriptive" : false,
	kind === "representative" ? "cell--representative" : false,
	status === "archived" ? "cell--archived" : false
].filter(Boolean).join(" "))
let resolvedScope = $derived<"row"|"col">(scope === "column" ? "col" : "row")
let role = $derived(scope === "column" ? "columnheader" : null)

let element = $state<HTMLElement>()
let title = $derived(element?.innerHTML ?? "Loading...")
</script>

<th
	class={headerClasses}
	{role}
	scope={resolvedScope}
	colspan={columnSpan}
	rowspan={rowSpan}
	{title}
	bind:this={element}>
	{@render children()}
</th>

<style lang="scss">
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
