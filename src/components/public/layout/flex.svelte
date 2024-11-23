<script lang="ts">
import type { FlexDirection, FlexJustifyContent } from "+/component"

export let direction: FlexDirection = "row"
export let justifyContent: FlexJustifyContent = "start"
export let mustPad = true

$: flexClasses = [
	direction,
	justifyContent,
	mustPad && "pad"
].filter(Boolean).join(" ")
</script>

<div class={flexClasses}>
	<slot/>
</div>

<style lang="scss">
@use "sass:map";
@use "sass:math";
@use "@/components/third-party/index";

@use "@material/layout-grid/variables";

div {
	display: flex;
	align-items: center;
	gap: 1rem;

	&.row {
		flex-flow: row wrap;
	}

	&.column {
		flex-flow: column wrap;
	}

	&.start {
		justify-content: flex-start;
	}

	&.center {
		justify-content: center;
	}

	&.stretch {
		justify-content: stretch;

		> :global(*) {
			flex: 1 0 100%;
		}
	}

	&.responsive_stretch {
		justify-content: stretch;

		$flexible_widths: (
			phone: 100%,
			tablet: calc(50% - (1rem / 2)),
			desktop: calc(25% - (3rem / 4))
		);

		@each $screen in map.keys($flexible_widths) {
			$flexible_width: map.get($flexible_widths, $screen);

			@media (min-width: #{map.get(variables.$breakpoints, $screen)}) {
				> :global(*) {
					flex: 1 0 $flexible_width;
				}
			}
		}
	}

	&.pad {
		padding: var(
			--mdc-layout-grid-margin-desktop,
			map.get(variables.$default-margin, desktop)
		);

		@each $screen in map.keys(variables.$breakpoints) {
			$margin: map.get(variables.$default-margin, $screen);

			@media (max-width: #{map.get(variables.$breakpoints, $screen)}) {
				padding: var(--mdc-layout-grid-margin-#{$screen}, $margin);
			}
		}
	}
}
</style>
