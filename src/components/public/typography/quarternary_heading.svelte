<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<h4 class="title-medium">
	{@render children()}
</h4>

<style lang="scss">
h4 {
	text-align: center;
}
</style>
