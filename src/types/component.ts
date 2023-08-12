export type CardStatus =
	| "reading"
	| "editing"
	| "confirming_deletion"

export interface ChoiceInfo {
	label: string,
	data: string
}
