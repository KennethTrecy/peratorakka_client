<div class="mdc-typography">
	<slot/>
</div>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/typography/mdc-typography";

	.mdc-typography > :global(*) {
		margin-top: 1rem;
	}
</style>
