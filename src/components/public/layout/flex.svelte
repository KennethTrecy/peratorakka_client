<div>
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
		flex-flow: row wrap;
		gap: 1rem;

		@each $screen in map.keys(variables.$breakpoints) {
			$margin: map.get(variables.$default-margin, $screen);

			@media (max-width: #{map.get(variables.$breakpoints, $screen)}) {
				padding: var(--mdc-layout-grid-margin-#{$screen}, $margin);
			}
		}
	}
</style>
