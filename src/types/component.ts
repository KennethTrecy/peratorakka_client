export type CardStatus =
	| "reading"
	| "editing"
	| "confirming_deletion"

export type DataTableCellKind =
	| "normal"
	| "numeric"

export type DataTableCellScope =
	| "row"
	| "column"
	| "none"

export interface ChoiceInfo {
	label: string,
	data: string
}

export type ButtonKind =
	| "button"
	| "submit"

export type GridCellKind =
	| "normal"
	| "wide"
	| "padder"
	| "full"
	| "majority"
	| "minority"
	| "narrow"
