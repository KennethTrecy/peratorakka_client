<script lang="ts">
	import Flex from "$/layout/flex.svelte"

	export let id: string|null
</script>

<form class="mdc-card" {id} on:submit>
	<div class="mdc-card__content">
		<Flex>
			<slot name="fields"/>
		</Flex>
	</div>
	<div class="mdc-card__actions">
		<div class="mdc-card__action-buttons">
			<slot name="button_group"/>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";

	@include card.core-styles;
</style>
