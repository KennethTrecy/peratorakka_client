<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<h1 class="headline-small">
	{@render children()}
</h1>
