<script lang="ts">
let { isLoading, progressBarLabel, progressRate = 0 }: {
	isLoading: boolean
	progressBarLabel: string
	progressRate?: number
} = $props()

let isFinished = $derived(progressRate === 1)
let isDetermined = $derived(progressRate !== 0 || !isLoading)
</script>

{#if isLoading}
	<div
		role="progressbar"
		class="progress"
		aria-label={progressBarLabel}
		aria-valuemin={0}
		aria-valuemax={1}>
		{#if !isFinished}
			<div class="determinate" style={"width: "+(Math.round(progressRate*10000)/100)+"%"}></div>
		{/if}
		{#if !isDetermined}
			<div class="indeterminate"></div>
		{/if}
	</div>
{/if}

<style lang="scss">
.indeterminate, .determinate {
	background-color: var(--md-sys-color-on-tertiary)
}
</style>
