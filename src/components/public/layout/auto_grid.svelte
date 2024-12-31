<div>
	<slot/>
</div>

<style lang="scss">
@use "@/components/third-party/index";

div {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: var(--gap-size);
	grid-auto-rows: 1fr;
	grid-auto-flow: row dense;
}
</style>
