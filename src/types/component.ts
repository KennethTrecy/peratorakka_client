import { type Readable, type Writable } from "svelte/store"

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
	| "triad"

export type TrialBalanceKind =
	| "adjusted"
	| "unadjusted"

export type FlexDirection =
	| "row"
	| "column"

export type FlexJustifyContent =
	| "start"
	| "center"
	| "stretch"
	| "responsive_stretch"

type ContextContent = Readable<unknown>|Writable<unknown>|(() => void|unknown)
export type ContextBundle = Record<string, ContextContent>

export interface BufferDelayConfiguration {
	rate: number,
	delay: number
}
