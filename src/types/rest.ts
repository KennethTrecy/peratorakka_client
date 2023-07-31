export interface GeneralError {
	message: string
}

export interface FieldError extends GeneralError {
	field: string
}

export type ErrorVariant =
	| GeneralError
	| FieldError
