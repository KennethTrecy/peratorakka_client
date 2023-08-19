<script lang="ts">
	import type { GridCellKind } from "+/component"

	export let kind: GridCellKind

	$: cellClasses = [
		"mdc-layout-grid__cell",
		kind === "normal" ? false : `mdc-layout-grid__cell--${kind}`
	].filter(Boolean).join(" ")
	$: role = kind === "padder" ? "presentation" : null
</script>

<div class={cellClasses} {role}>
	<slot/>
</div>


<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/layout-grid/mdc-layout-grid";

	.mdc-layout-grid__cell--wide {
		@extend .mdc-layout-grid__cell--span-4-phone;
		@extend .mdc-layout-grid__cell--span-6-tablet;
		@extend .mdc-layout-grid__cell--span-6-desktop;
	}

	.mdc-layout-grid__cell--narrow {
		@extend .mdc-layout-grid__cell--span-2-phone;
		@extend .mdc-layout-grid__cell--span-4-tablet;
		@extend .mdc-layout-grid__cell--span-3-desktop;
	}

	.mdc-layout-grid__cell--padder {
		@extend .mdc-layout-grid__cell--span-1-phone;
		@extend .mdc-layout-grid__cell--span-1-tablet;
		@extend .mdc-layout-grid__cell--span-3-desktop;
	}

	.mdc-layout-grid__cell--full {
		@extend .mdc-layout-grid__cell--span-4-phone;
		@extend .mdc-layout-grid__cell--span-8-tablet;
		@extend .mdc-layout-grid__cell--span-12-desktop;
	}

	.mdc-layout-grid__cell--majority {
		@extend .mdc-layout-grid__cell--span-4-phone;
		@extend .mdc-layout-grid__cell--span-5-tablet;
		@extend .mdc-layout-grid__cell--span-8-desktop;
	}

	.mdc-layout-grid__cell--minority {
		@extend .mdc-layout-grid__cell--span-4-phone;
		@extend .mdc-layout-grid__cell--span-3-tablet;
		@extend .mdc-layout-grid__cell--span-4-desktop;
	}
</style>
