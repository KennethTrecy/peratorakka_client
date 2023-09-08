<div class="mdc-typography">
	<slot/>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/typography/mdc-typography";

	.mdc-typography > :global(*) {
		margin-top: 1rem;
	}

	.mdc-typography {
		max-width: 70ch;
	}
</style>
