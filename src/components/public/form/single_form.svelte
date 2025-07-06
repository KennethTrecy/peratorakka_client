<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import Flex from "$/layout/flex.svelte"
import FormBase from "$/form/base.svelte"
import Grid from "$/layout/grid.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import InnerGrid from "$/layout/inner_grid.svelte"

let {
	errors,
	isConnecting,
	onsubmit,
	description_layer,
	field_layer,
	action_layer
}: {
	errors: GeneralError[]
	isConnecting: boolean
	onsubmit: (event: SubmitEvent) => void
	description_layer: Snippet
	field_layer?: Snippet
	action_layer: Snippet
} = $props()
</script>

<Grid>
	<InnerGrid>
		<GridCell kind="padder"/>
		<GridCell kind="wide">
			<Flex direction="column" mustPad={false}>
				<div class="single_form">
					<FormBase id={null} {isConnecting} {errors} {onsubmit}>
						{#snippet lead_content()}
							<img src="logo.png" alt="Peratorakka logo"/>
							{@render description_layer()}
						{/snippet}
						{#snippet field_content()}
							<GridCell kind="padder"/>
							<InnerGrid>
								{@render field_layer?.()}
							</InnerGrid>
						{/snippet}
						{#snippet action_buttons()}
							{@render action_layer()}
						{/snippet}
					</FormBase>
				</div>
			</Flex>
		</GridCell>
		<GridCell kind="padder"/>
	</InnerGrid>
</Grid>

<style lang="scss">
.single_form {
	text-align: center;
	padding-top: 1rem;
	width: 100%;

	:global(.card-content) {
		min-height: 25rem;
	}

	:global(label) {
		text-align: left;
	}
}
</style>
