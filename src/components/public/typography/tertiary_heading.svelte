<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<h3 class="title-large">
	{@render children()}
</h3>

<style lang="scss">
h3 {
	text-align: center;
}
</style>
