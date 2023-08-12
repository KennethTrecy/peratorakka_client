<script lang="ts">
	export let individualName: string
</script>

<section class="s12 m12 l12 grid small-space">
	<h2 class="s12 m12 l12 center-align">Add {individualName}</h2>
	<div class="s12 m12 l6 grid small-space description">
		<slot name="description"></slot>
	</div>
	<div class="s12 m12 l6 grid large-space">
		<slot name="form"></slot>
	</div>
</section>

<style lang="scss">
	@use "@/components/third-party/index";

	.description {
		align-content: flex-start;
	}
</style>
