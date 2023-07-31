export interface SimpleError {
	message: string
}

export interface FieldError extends SimpleError {
	field: string
}

export type GeneralError =
	| SimpleError
	| FieldError
