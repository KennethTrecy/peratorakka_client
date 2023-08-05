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
	statusCode: number,
	action: () => void
}

export interface RequesterConstraints {
	path: string,
	manualResponseHandlers: RequesterCase[],
	expectedErrorStatusCodes: number[]
}

export interface RequesterDependencies {
	isConnecting: Writable<boolean>,
	errors: Writable<GeneralError[]>
}

export interface RequesterInfo extends RequesterDependencies {
	send: (requestInfo: Partial<Request>) => void
}
