<script lang="ts">
	export let shouldCenterAlign: boolean = true

	const basicClasses = [ "middle-align" ]
	$: resolvedClasses = (
		shouldCenterAlign
			? [ ...basicClasses, "center-align" ]
			: [ ...basicClasses ]
	).join(" ")
</script>

<span class={resolvedClasses}>
	<span class="circle">
		<img class="small" src="logo.png" alt="Peratorakka logo"/>
	</span>
	<span data-app-name>
		Peratorakka
	</span>
</span>

<style lang="scss">
	@use "@/components/third-party/index";

	[data-app-name] {
		@extend h5;

		margin-top: 0em;
		margin-bottom: 0em;
		margin-left: 0.25em;
	}
</style>
