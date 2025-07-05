<script lang="ts">
import type { Snippet } from "svelte"

let { tag, children }: {
	tag: string
	children: Snippet
} = $props()
</script>

<svelte:element this={tag} class="input-field">
	{@render children()}
</svelte:element>

<style lang="scss">
:global(.input-field:has([disabled])) {
	--input-color: var(--md-ref-palette-neutral60);
	--md-sys-color-on-surface: var(--input-color);
	--md-sys-color-primary: var(--input-color);
	color: var(--input-color);
}
</style>
