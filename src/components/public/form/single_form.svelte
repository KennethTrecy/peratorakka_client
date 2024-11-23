<script lang="ts">
import type { GeneralError } from "+/rest"

import Flex from "$/layout/flex.svelte"
import FormBase from "$/form/base.svelte"
import Grid from "$/layout/grid.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import InnerGrid from "$/layout/inner_grid.svelte"

export let errors: GeneralError[]
export let isConnecting: boolean
</script>

<Grid>
	<InnerGrid>
		<GridCell kind="padder"/>
		<GridCell kind="wide">
			<Flex direction="column" mustPad={false}>
				<div class="single_form">
					<FormBase id={null} {isConnecting} {errors} on:submit>
						<svelte:fragment slot="lead_content">
							<img src="logo.png" alt="Peratorakka logo"/>
							<slot name="description_layer"/>
						</svelte:fragment>
						<InnerGrid slot="field_content">
							<slot name="field_layer"/>
						</InnerGrid>
						<slot slot="action_buttons" name="action_layer"/>
					</FormBase>
				</div>
			</Flex>
		</GridCell>
		<GridCell kind="padder"/>
	</InnerGrid>
</Grid>

<style lang="scss">
@use "@/components/third-party/index";

.single_form {
	text-align: center;
	padding-top: 1rem;
	width: 100%;

	:global(.card-content) {
		min-height: 25rem;
	}
}
</style>
