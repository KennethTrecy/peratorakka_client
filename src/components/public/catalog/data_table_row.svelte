<tr class="mdc-data-table__row">
	<slot/>
</tr>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;
</style>
