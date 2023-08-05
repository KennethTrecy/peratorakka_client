<script lang="ts">
	import type { Entity } from "%/currencies/types"

	export let data: Entity
</script>

<article class="secondary-container">
	<h3>{data.code}</h3>
	<p>{data.name}</p>
	<div class="nav">
		<button>
			<i>edit</i>
		</button>
		<button>
			<i>delete</i>
		</button>
	</div>
</article>


<style lang="scss">
	@use "@/components/third-party/index";

	h3 {
		@extend h5;
	}

	div.nav {
		@extend nav;
	}
</style>
