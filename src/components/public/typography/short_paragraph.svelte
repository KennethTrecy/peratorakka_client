<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<p class="body-small">
	{@render children()}
</p>

<style lang="scss">
.body-small + :global(.body-small) {
	margin-top: 1rem;
}

.body-small:first-child:last-child {
	margin: 1rem 0rem;
}
</style>
