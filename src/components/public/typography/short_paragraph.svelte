<p class="mdc-typography--body2">
	<slot/>
</p>


<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/typography/mdc-typography";

	p + :global(p) {
		margin-top: 1rem;
	}
</style>
