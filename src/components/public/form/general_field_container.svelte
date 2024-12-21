<script lang="ts">
export let tag: string
</script>

<svelte:element this={tag} class="input-field">
	<slot></slot>
</svelte:element>

<style lang="scss">
@use "@/components/third-party/index";

:global(.input-field:has([disabled])) {
	--input-color: var(--md-ref-palette-neutral60);
	--md-sys-color-on-surface: var(--input-color);
	--md-sys-color-primary: var(--input-color);
	color: var(--input-color);
}
</style>
