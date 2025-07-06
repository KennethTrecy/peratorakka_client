import type { Readable, Writable } from "svelte/store"
import type { GeneralError } from "+/rest"
import type { RestorableEntity } from "+/entity"

export type CardStatus =
	| "reading"
	| "editing"
	| "confirming_deletion"
	| "confirming_restoration"
	| "confirming_nullification"

export type DataTableCellKind =
	| "normal"
	| "numeric"
	| "descriptive"
	| "representative"

export type DataTableCellStatus =
	| "present"
	| "archived"

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
	| "almost_full"
	| "full"
	| "majority"
	| "minority"
	| "narrow"
	| "triad"
	| "pair"
	| "hextet"

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

export type TextAlignment =
	| "left"
	| "center"

export type TextFieldVariant =
	| "email"
	| "text"
	| "date"

type ContextContent = Readable<unknown>|Writable<unknown>|(() => void|unknown)
export type ContextBundle = Record<string, ContextContent>

export interface BufferDelayConfiguration {
	rate: number,
	delay: number
}

export interface RestorableItemOptions {
	isConnectingToUpdate: Readable<boolean>
	updateErrors: Writable<GeneralError[]>
	requestUpdate: () => Promise<void>
	isConnectingToDelete: Readable<boolean>
	deleteErrors: Writable<GeneralError[]>
	requestDelete: () => Promise<void>
	isConnectingToRestore: Readable<boolean>
	restoreErrors: Writable<GeneralError[]>
	requestRestore: () => Promise<void>
	isConnectingToForceDelete: Readable<boolean>
	forceDeleteErrors: Writable<GeneralError[]>
	requestForceDelete: () => Promise<void>
}

export interface ResourceDependencyInfo<T extends RestorableEntity> {
	partialPath: string,
	mainSortCriterion: string,
	resourceKey: string,
	getResources: () => T[],
	setResources: (resources: T[]) => void
}

interface LinkedResource {
	resourceKey: string,
	resources: RestorableEntity[]
}

export interface HighResourceDependencyInfo<T extends RestorableEntity>
extends ResourceDependencyInfo<T> {
	getLinkedResources: () => LinkedResource[],
	setLinkedResources: (resources: RestorableEntity[][]) => void,
}

export function isHighResourceDependencyInfo<T extends RestorableEntity>(data: any)
: data is HighResourceDependencyInfo<T> {
	const keys = Object.keys(data)
	return keys.includes("getLinkedResources")
}
