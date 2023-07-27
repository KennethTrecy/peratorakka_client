<script lang="ts">
	import type { MenuItemInfo } from "@/components/shell/types"

	let info: MenuItemInfo
</script>

<a href={info.link}>
	<i>{info.icon}</i>
	<span>{info.label}</span>
</a>
