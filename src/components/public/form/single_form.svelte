<script lang="ts">
	import Grid from "$/layout/grid.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
</script>

<Grid>
	<InnerGrid>
		<GridCell kind="padder"/>
		<GridCell kind="wide">
			<form class="mdc-card" on:submit|preventDefault>
				<div class="mdc-card__content">
					<img src="logo.png" alt="Peratorakka logo"/>
					<slot name="description_layer"/>
				</div>
				<div class="mdc-card__content">
					<Grid>
						<InnerGrid>
							<slot name="field_layer"/>
						</InnerGrid>
					</Grid>
				</div>
				<div class="mdc-card__actions">
					<div class="mdc-card__action-buttons">
						<slot name="action_layer"/>
					</div>
				</div>
			</form>
		</GridCell>
		<GridCell kind="padder"/>
	</InnerGrid>
</Grid>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";

	@include card.core-styles;

	.mdc-card__content {
		text-align: center;
		padding: 1rem;

		&:first-child > img {
			margin-bottom: 1rem;
		}

		& + & {
			padding-top: 0rem;
		}
	}

	.mdc-card__actions {
		justify-content: center;
	}
</style>
