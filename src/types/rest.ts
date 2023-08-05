import type { Writable } from "svelte/store"
import type { GeneralError } from "+/rest"

export interface SimpleError {
	message: string
}

export interface FieldError extends SimpleError {
	field: string
}

export type GeneralError =
	| SimpleError
	| FieldError

interface RequesterCase {
	status: number,
	action: () => void
}

export interface RequesterConstraints {
	path: string,
	defaultRequestConfiguration: Partial<Request>,
	manualResponseHandlers: RequesterCase[],
	expectedErrorStatusCodes: number[]
}

export interface RequesterInfo {
	isConnecting: Writable<boolean>,
	errors: Writable<GeneralError[]>,
	send: (requestInfo: Partial<Request>) => void
}
