<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<article class="container">
	{@render children()}
</article>
