<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<h1 class="headline-medium">
	{@render children()}
</h1>

<style lang="scss">
h1 {
	text-align: center;
}
</style>
