<script lang="ts">

</script>

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

		$text_container_width: 70ch;
		$gap: 1rem;

		display: flex;
		flex-direction: row wrap;
		align-items: center;
		justify-content: center;
		gap: $gap;

		max-width: calc(#{$text_container_width * 2} + #{$gap} + var(
			--mdc-layout-grid-margin-desktop,
			#{map.get(variables.$default-margin, desktop)}
		));

		@each $screen in map.keys(variables.$breakpoints) {
			$margin: map.get(variables.$default-margin, $screen);

			@media (max-width: #{map.get(variables.$breakpoints, $screen)}) {
				padding: var(--mdc-layout-grid-margin-#{$screen}, $margin);
				max-width: calc(#{$text_container_width * 2} + #{$gap} + var(
					--mdc-layout-grid-margin-#{$screen},
					#{map.get(variables.$default-margin, $screen)}
				));
			}
		}
	}
</style>
