<script lang="ts">
	import { onMount } from "svelte"
	import { MDCLinearProgress } from "@material/linear-progress"

	export let isLoading: boolean
	export let progressBarLabel: string
	export let progressRate: number = 0

	$: isIndetermined = progressRate === 0
	$: progressBarClasses = [
		"mdc-linear-progress",
		isLoading
			? (
				isIndetermined
					? "mdc-linear-progress--indeterminate"
					: null
			): "mdc-linear-progress--closed"
	].filter(Boolean).join(" ")

	let progressBar: MDCLinearProgress|null = null
	let progressBarElement: any
	onMount(() => {
		progressBar = new MDCLinearProgress(progressBarElement)
	})
	$: {
		if (progressBar) {
			progressBar.buffer = progressRate + (1 - progressRate) * 0.5
			progressBar.progress = progressRate
		}
	}
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
