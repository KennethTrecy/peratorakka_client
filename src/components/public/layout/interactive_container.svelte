<script lang="ts">

</script>

<div class="container">
	<div class="container__content">
		<div class="container__text">
			<slot name="text"/>
		</div>
		<div class="container__widget">
			<slot name="widget"/>
		</div>
	</div>
</div>


<style lang="scss">
	@use "sass:map";
	@use "@/components/third-party/new_index";

	@use "@material/layout-grid/variables";

	.container {
		padding: var(
			--mdc-layout-grid-margin-desktop,
			map.get(variables.$default-margin, desktop)
		);

		$text_container_width: 70ch;
		$gap: 1rem;

		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: center;

		@each $screen in map.keys(variables.$breakpoints) {
			$margin: map.get(variables.$default-margin, $screen);

			@media (max-width: #{map.get(variables.$breakpoints, $screen)}) {
				padding: var(--mdc-layout-grid-margin-#{$screen}, $margin);
				max-width: calc(#{$text_container_width * 2} + #{$gap});
			}
		}

		&__content {
			display: flex;
			flex-flow: row wrap;
			align-items: flex-start;
			justify-content: center;

			gap: $gap;
			max-width: calc(#{$text_container_width * 1.5} + #{$gap});
			margin: auto;
		}

		&__widget {
			flex: 1;
		}
	}
</style>
