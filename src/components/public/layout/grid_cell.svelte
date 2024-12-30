<script lang="ts">
import type { GridCellKind } from "+/component"

export let kind: GridCellKind
let otherClasses: string = ""

export { otherClasses as class }

$: cellClasses =  ((
	kind === "wide"
	? [ "s6", "m6", "l6" ]
	: kind === "narrow"
		? [ "s3", "m3", "l3" ]
		: kind === "padder"
			? [ "s3", "m3", "l3" ]
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
								: []
	).join(" ")+" "+otherClasses).trim()
$: role = kind === "padder" ? "presentation" : null
</script>

<div class={cellClasses} {role}>
	<slot/>
</div>

<style lang="scss">
@use "@/components/third-party/index";
</style>
