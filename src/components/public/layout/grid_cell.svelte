<script lang="ts">
import type { Snippet } from "svelte"
import type { GridCellKind } from "+/component"

let { kind, rowSpan = 0, children }: {
	kind: GridCellKind
	rowSpan?: number
	children?: Snippet
} = $props()

let cellClasses =  $derived((
	kind === "wide"
	? [ "s12", "m8", "l6" ]
	: kind === "narrow"
		? [ "s12", "m12", "l3" ]
		: kind === "padder"
			? [ "s12", "m2", "l3" ]
			: kind === "almost_full"
				? [ "s12", "m8", "l8" ]
				: kind === "full"
					? [ "s12" ]
					: kind === "majority"
						? [ "s12", "m7", "l8" ]
						: kind === "minority"
							? [ "s12", "m5", "l4" ]
							: kind === "triad"
								? [ "s12", "m4", "l4" ]
								: kind === "pair"
									? [ "s12", "m6", "l6" ]
									: kind === "hextet"
										? [ "s4", "m4", "l2" ]
										: []
	).join(" "))
let role = $derived(kind === "padder" ? "presentation" : null)
</script>

<div class={cellClasses} {role} style={rowSpan > 0 ? "grid-row: span "+rowSpan : ""}>
	{@render children?.()}
</div>
