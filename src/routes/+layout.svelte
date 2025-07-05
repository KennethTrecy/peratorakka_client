<script lang="ts">
import "@/components/third-party/_index.scss"
import type { Snippet } from "svelte"

import Shell from "%/shell.svelte"

let { children }: { children: Snippet } = $props()
</script>


<Shell>
	{#snippet main()}
		{@render children()}
	{/snippet}
</Shell>
