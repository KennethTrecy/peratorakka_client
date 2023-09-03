<script lang="ts">
	import type { FlexDirection } from "+/component"

	export let direction: FlexDirection = "row"

	$: flexClasses = [
		direction
	].filter(Boolean).join(" ")
</script>

<div class={flexClasses}>
	<slot/>
</div>


<style lang="scss">
	@use "sass:map";
	@use "@/components/third-party/new_index";

	@use "@material/layout-grid/variables";

	div {
		padding: var(
			--mdc-layout-grid-margin-desktop,
			map.get(variables.$default-margin, desktop)
		);

		display: flex;
		align-items: center;
		gap: 1rem;

		@each $screen in map.keys(variables.$breakpoints) {
			$margin: map.get(variables.$default-margin, $screen);

			@media (max-width: #{map.get(variables.$breakpoints, $screen)}) {
				padding: var(--mdc-layout-grid-margin-#{$screen}, $margin);
			}
		}

		&.row {
			flex-flow: row wrap;
		}

		&.column {
			flex-flow: column wrap;
		}
	}
</style>
