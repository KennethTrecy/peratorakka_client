<script lang="ts">
	import { onMount } from "svelte"
	import { MDCLinearProgress } from "@material/linear-progress"

	import { DEFAULT_BUFFER_DELAY_CONFIGURATIONS } from "#/component"

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
	let oldProgressRate = 0
	let bufferRate = 0
	onMount(() => {
		progressBar = new MDCLinearProgress(progressBarElement)
	})
	$: {
		if (progressBar && !isIndetermined) {
			progressBar.progress = progressRate

			if (oldProgressRate > progressRate) {
				bufferRate = 0
			}

			oldProgressRate = progressRate

			for (const delayConfiguration of DEFAULT_BUFFER_DELAY_CONFIGURATIONS) {
				const calculatedBuffer = progressRate + (1 - progressRate) * delayConfiguration.rate
				setTimeout(() => {
					if (bufferRate < calculatedBuffer) {
						bufferRate = calculatedBuffer
					}
				}, delayConfiguration.delay)
			}
		}
	}
	$: {
		if (progressBar && !isIndetermined) {
			progressBar.buffer = bufferRate
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
	<div class="mdc-linear-progress__buffer">
		<div class="mdc-linear-progress__buffer-bar"></div>
		<div class="mdc-linear-progress__buffer-dots"></div>
	</div>
	<div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
		<span class="mdc-linear-progress__bar-inner"></span>
	</div>
	<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
		<span class="mdc-linear-progress__bar-inner"></span>
	</div>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/linear-progress";

	@include linear-progress.core-styles;
</style>