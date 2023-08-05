import type {
	GeneralError,
	RequesterConstraints,
	RequesterDependencies,
	RequesterActions
} from "+/rest"

import { get } from "svelte/store"

import { serverURL } from "$/global_state"

export default async function sendJSONRequest(
	specialRequestInfo: Partial<Request>,
	constraints: RequesterConstraints,
	dependencies: RequesterDependencies
): Promise<void> {
	const currentServerURL = get(serverURL)
	dependencies.isConnecting.set(true)

	try {
		const response = await fetch(constraints.path, {
			"mode": "cors",
			"credentials": "include",
			"referrer": currentServerURL,
			"headers": {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			...constraints.defaultRequestConfiguration
			...specialRequestInfo
		})

		const statusCode = response.status
		const caseIndex = constraints.manualResponseHandlers.findIndex(handlerInfo => {
			return handlerInfo.statusCode === statusCode
		})

		if (caseIndex > -1) {
			const case = constraints.manualResponseHandlers[caseIndex]
			case.action()
		} else if (expectedErrorStatusCodes.includes(statusCode)) {
			dependencies.errors.set((await response.json()).errors)
		} else {
			throw new Error(
				`Unexpected status code was returned by the server: ${response.status}.`
			)
		}
	} catch (receivedErrors) {
		if (Array.isArray(receivedErrors)) {
			dependencies.errors.set(receivedErrors)
		} else {
			dependencies.errors.set([
				{
					"message": (receivedErrors as Error).message
				}
			])
		}
	}

	dependencies.isConnecting.set(false)
}
