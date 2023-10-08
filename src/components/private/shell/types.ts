interface AbstractMenuComponentInfo {
	type: string
}

export interface MenuDividerInfo extends AbstractMenuComponentInfo {
	type: "divider"
}

export interface MenuItemInfo extends AbstractMenuComponentInfo {
	type: "item"
	link: string
	icon: string
	label: string
}
