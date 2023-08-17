<script lang="ts">

</script>

<div class="mdc-layout-grid">
	<div class="mdc-layout-grid__inner">
		<div class="mdc-layout-grid__cell" role="presentation"></div>
		<div class="mdc-layout-grid__cell">
			<form class="mdc-card" on:submit|preventDefault>
				<div class="mdc-card__content">
					<img src="logo.png" alt="Peratorakka logo"/>
					<slot name="description_layer"/>
				</div>
				<div class="mdc-card__content">
					<slot name="field_layer"/>
				</div>
				<slot name="action_layer"/>
			</form>
		</div>
		<div class="mdc-layout-grid__cell" role="presentation"></div>
	</div>
</div>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";
	@use "@material/layout-grid/mdc-layout-grid";

	@include card.core-styles;

	.mdc-card__content {
		text-align: center;
		padding: 1rem;

		& + & {
			padding-top: 0rem;
		}
	}
</style>
