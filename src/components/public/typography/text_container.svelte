<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<div class="container">
	{@render children()}
</div>

<style lang="scss">
.container {
	max-width: 70ch;

	> .container {
		margin-top: 1rem;
	}
}
</style>
