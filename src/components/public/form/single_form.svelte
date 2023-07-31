<script lang="ts">

</script>

<form class="middle-align center-align grid" on:submit>
	<div class="s1 m2 l3"></div>
	<div class="s10 m8 l6">
		<div class="fill middle-align center-align">
			<div class="center-align large-padding">
				<img class="small extra" src="logo.png" alt="Peratorakka logo"/>
				<div class="space"></div>
				<slot name="description_layer"/>
				<div class="space"></div>
				<slot name="field_layer"/>
				<div class="space"></div>
				<slot name="action_layer"/>
			</div>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/index";

	form {
		width: 100%;
		height: 80%;
	}
</style>
