<script lang="ts">
	import { onMount } from "svelte"
	import { MDCLinearProgress } from "@material/linear-progress"

	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]

	$: hasData = data.length > 0
	$: progressBarLabel = isConnecting
		? `Loading ${collectiveName.toLocaleLowerCase()}...`
		: `Finished attempt on loading ${collectiveName.toLocaleLowerCase()}.`
	$: progressBarClasses = [
		"mdc-linear-progress",
		isConnecting ? "mdc-linear-progress--indeterminate" : "mdc-linear-progress--closed"
	].join(" ")

	let progressBar: MDCLinearProgress|null = null
	let progressBarElement: any
	onMount(() => {
		progressBar = new MDCLinearProgress(progressBarElement)
	})
</script>

<GridCell kind="full">
	<SecondaryHeading>Available {collectiveName}</SecondaryHeading>
</GridCell>
<GridCell kind="full">
	<div
		role="progressbar"
		class={progressBarClasses}
		aria-label={progressBarLabel}
		aria-valuemin={0}
		aria-valuemax={1}
		bind:this={progressBarElement}>
		<div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
			<span class="mdc-linear-progress__bar-inner"></span>
		</div>
	</div>
</GridCell>

{#if isConnecting}
	<GridCell kind="full">
		<ElementalParagraph>
			Please wait while the client request the list from the server.
		</ElementalParagraph>
	</GridCell>
{:else if hasData}
	<GridCell kind="full">
		<ElementalParagraph>
			<slot name="filled_collection_description"></slot>
		</ElementalParagraph>
	</GridCell>
	<slot name="cards"></slot>
{:else}
	<GridCell kind="full">
		<ElementalParagraph>
			<slot name="empty_collection_description"></slot>
		</ElementalParagraph>
	</GridCell>
{/if}

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/linear-progress";

	@include linear-progress.core-styles;
</style>
