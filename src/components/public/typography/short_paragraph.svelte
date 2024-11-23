<p class="body-small">
	<slot/>
</p>


<style lang="scss">
@use "@/components/third-party/index";

.body-small + .body-small {
	margin-top: 1rem;
}
</style>
