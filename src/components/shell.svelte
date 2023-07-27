<script lang="ts">

</script>

<header class="primary-container">
	<nav>
		<button class="circle transparent">
			<i>menu</i>
		</button>
		<p class="max center-align">Peratorakka</p>
		<button class="circle transparent">
			<img class="responsive" src="" alt="Peratorakka logo"/>
		</button>
	</nav>
</header>
<main>
	<slot name="main"></slot>
</main>
<footer class="">
	Copyright © 2023 by Kenneth Trecy Tobias.
</footer>
<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
	@use "@/components/third-party/index";
</style>
