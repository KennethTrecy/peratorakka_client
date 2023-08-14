<script lang="ts">
	export let shouldCenterAlign: boolean = true

	const basicClasses = [ "mdc-top-app-bar__title" ]
	$: resolvedClasses = (
		shouldCenterAlign
			? [ ...basicClasses, "center-align" ]
			: [ ...basicClasses ]
	).join(" ")
</script>

<span class={resolvedClasses}>
	<span>
		<img src="logo.png" alt="Peratorakka logo"/>
	</span>
	<span data-app-name>
		Peratorakka
	</span>
</span>

<style lang="scss">
	@use "@/components/third-party/new_index";
	@use "@material/top-app-bar/mdc-top-app-bar";

	[data-app-name] {
		margin-top: 0em;
		margin-bottom: 0em;
		margin-left: 0.25em;
	}
</style>
