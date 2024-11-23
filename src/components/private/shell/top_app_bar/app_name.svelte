<span class="brand-logo">
	<img src="logo.png" alt="Peratorakka logo"/>
	<span data-app-name>
		Peratorakka
	</span>
</span>

<style lang="scss">
@use "@/components/third-party/index";

.brand-logo {
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: center;
	gap: 1rem;

	> img {
		height: 3rem;
		width: auto;
		border: 1px index.$surface solid;
		border-radius: 6px;
	}

	// Attempted to use the third-party variable but does not work due to compatibility issues.
	// For that reason, third-party variables are not available and needs to be hard-coded.
	// Permalink: https://github.com/materializecss/materialize/blob/c1f64765acf74c65e5e471c1884be7713ffde5fa/sass/components/_variables.scss#L30C1-L30C14
	@media only screen and (min-width: 993px) {
		padding-left: 1rem;
		padding-right: 1rem;
	}
}
</style>
