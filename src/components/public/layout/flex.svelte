<script lang="ts">
import type { Snippet } from "svelte"
import type { FlexDirection, FlexJustifyContent } from "+/component"

let {
	direction = "row",
	justifyContent = "start",
	mustPad = true,
	children
}: {
	direction?: FlexDirection
	justifyContent?: FlexJustifyContent
	mustPad?: boolean
	children: Snippet
} = $props()

let flexClasses = $derived([
	`${direction}-direction`,
	justifyContent,
	mustPad && "pad"
].filter(Boolean).join(" "))
</script>

<div class={flexClasses}>
	{@render children()}
</div>

<style lang="scss">
@use "sass:map";
@use "sass:math";
@use "@material/layout-grid/variables";

div {
	display: flex;
	align-items: center;
	gap: 1rem;

	&.row-direction {
		flex-flow: row wrap;
	}

	&.column-direction {
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
