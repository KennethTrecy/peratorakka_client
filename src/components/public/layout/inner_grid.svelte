<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<div class="row">
	{@render children()}
</div>

<style lang="scss">
.row {
	grid-auto-flow: row dense;
}
</style>
