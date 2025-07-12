<script lang="ts">
import type { Snippet } from "svelte"

let { children }: {
	children: Snippet
} = $props()
</script>

<h3 class="title-medium">
	{@render children()}
</h3>

<style lang="scss">
h3 {
	margin-top: 1.168rem;
	width: 100%;
}
</style>
