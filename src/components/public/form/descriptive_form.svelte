<script lang="ts">
	export let individualName: string
	export let mayShowForm: boolean
</script>

<section class="s12 m12 l12 grid small-space">
	<h2 class="s12 m12 l12 center-align">Add {individualName}</h2>
	<div class="s12 m12 l6 grid small-space description">
		<slot name="description"></slot>
	</div>
	<div class="s12 m12 l6 grid large-space">
		{#if mayShowForm}
			<slot name="form"></slot>
		{:else}
			<div class="s12 m12 l12 grid small-space border middle-align">
				<div class="s2 m2 l3"></div>
				<div class="s8 m8 l6 grid small-space">
					<slot name="requirement"></slot>
				</div>
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	@use "@/components/third-party/index";

	.description {
		align-content: flex-start;
	}
</style>
