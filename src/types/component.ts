import { Readable } from "svelte/store"

export type CardStatus =
	| "reading"
	| "editing"
	| "confirming_deletion"

export type DataTableCellKind =
	| "normal"
	| "numeric"
	| "descriptive"

export type DataTableCellScope =
	| "row"
	| "column"

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

export type TrialBalanceKind =
	| "adjusted"
	| "unadjusted"

export type FlexDirection =
	| "row"
	| "column"

type ContextContent = Readable<unknown>|(...arguments: unknown[]) => void|unknown
export type ContextBundle = Record<string, ContextContent>
