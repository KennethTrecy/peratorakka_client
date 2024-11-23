<script lang="ts">
export let isLoading: boolean
export let progressBarLabel: string
export let progressRate: number = 0

$: isFinished = progressRate === 1
$: isDetermined = progressRate !== 0 || !isLoading
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
@use "@/components/third-party/index";

.indeterminate {
	background-color: var(--md-sys-color-tertiary)
}
</style>
