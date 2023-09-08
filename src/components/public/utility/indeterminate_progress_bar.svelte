<script lang="ts">
	import { onMount } from "svelte"
	import { MDCLinearProgress } from "@material/linear-progress"

	export let isLoading: boolean
	export let progressBarLabel: string

	$: progressBarClasses = [
		"mdc-linear-progress",
		isLoading ? "mdc-linear-progress--indeterminate" : "mdc-linear-progress--closed"
	].join(" ")

	let progressBar: MDCLinearProgress|null = null
	let progressBarElement: any
	onMount(() => {
		progressBar = new MDCLinearProgress(progressBarElement)
	})
</script>

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

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/linear-progress";

	@include linear-progress.core-styles;
</style>
