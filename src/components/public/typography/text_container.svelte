<div class="container">
	<slot/>
</div>

<style lang="scss">
@use "@/components/third-party/index";

.container {
	max-width: 70ch;

	> .container {
		margin-top: 1rem;
	}
}
</style>
