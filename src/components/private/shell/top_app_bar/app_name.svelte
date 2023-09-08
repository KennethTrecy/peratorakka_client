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
	<img src="logo.png" alt="Peratorakka logo"/>
	<span data-app-name>
		Peratorakka
	</span>
</span>

<style lang="scss">
	@use "@/components/third-party/index";
	@use "@material/theme/theme-color";
	@use "@material/top-app-bar/mdc-top-app-bar";

	.mdc-top-app-bar__title {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		> img {
			height: 3rem;
			width: auto;
			border: 1px #{theme-color.$surface} solid;
			border-radius: 6px;
		}

		> [data-app-name] {
			font-size: 2rem;
		}
	}
</style>
