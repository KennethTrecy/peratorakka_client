<div class="interactive_container">
	<div class="interactive_container__content">
		<div class="interactive_container__text">
			<slot name="text"/>
		</div>
		<div class="interactive_container__widget">
			<slot name="widget"/>
		</div>
	</div>
</div>


<style lang="scss">
@use "sass:map";
@use "@/components/third-party/index";

@use "@material/layout-grid/variables";

.interactive_container {
	$text_container_width: 70ch;
	$gap: 1rem;

	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: center;

	&__content {
		display: flex;
		flex-flow: row wrap;
		align-items: flex-start;
		justify-content: center;

		gap: $gap;
		max-width: calc(#{$text_container_width * 1.75} + #{$gap});
		width: calc(#{$text_container_width * 1.75} + #{$gap});
		margin: auto;
	}

	&__text {
		max-width: #{$text_container_width};
	}

	&__widget {
		flex: 1;
	}
}
</style>
