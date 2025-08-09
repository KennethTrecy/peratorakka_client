<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<p class="supporting-text">
	{@render children()}
</p>

<style lang="scss">
p {
	width: 100%;
}
</style>
