import type { Writable } from "svelte/store"
import type { GeneralError } from "+/rest"

export interface SimpleError {
	message: string
}

export interface FieldError extends SimpleError {
	field: string
}

export function isFieldError(error: any): error is FieldError {
	return Object.keys(error).includes("field")
}

export type GeneralError =
	| SimpleError
	| FieldError

interface RequesterCase {
	statusCode: number,
	action: (response: Response) => Promise<void>
}

export interface RequesterConstraints {
	path: string,
	defaultRequestConfiguration: Partial<RequestInit>,
	manualResponseHandlers: RequesterCase[],
	expectedErrorStatusCodes: number[]
}

export interface RequesterDependencies {
	isConnecting: Writable<boolean>,
	errors: Writable<GeneralError[]>
}

export interface RequesterInfo extends RequesterDependencies {
	send: (requestInfo: Partial<RequestInit>) => Promise<void>
}
