<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<h2 class="headline-small">
	{@render children?.()}
</h2>

<style lang="scss">
h2 {
	text-align: center;
}
</style>
