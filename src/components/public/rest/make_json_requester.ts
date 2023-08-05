import type { GeneralError, RequesterConstraints, RequesterInfo } from "+/rest"

import { get, writable } from "svelte/store"

import { serverURL } from "$/global_state"

export default function makeJSONRequester(constraints: RequesterConstraints): RequesterInfo {
	let isConnecting = writable(false)
	let errors = writable<GeneralError[]>([])

	async function send() {
		const currentServerURL = get(serverURL)
		isConnecting.set(true)

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
			})

			const statusCode = response.status
			const caseIndex = constraints.manualResponseHandlers.findIndex(handlerInfo => {
				return handlerInfo.statusCode === statusCode
			})

			if (caseIndex > -1) {
				const case = constraints.manualResponseHandlers[caseIndex]
				case.action()
			} else if (expectedErrorStatusCodes.includes(statusCode)) {
				errors.set((await response.json()).errors)
			} else {
				throw new Error(
					`Unexpected status code was returned by the server: ${response.status}.`
				)
			}
		} catch (receivedErrors) {
			if (Array.isArray(receivedErrors)) {
				errors.set(receivedErrors)
			} else {
				errors.set([
					{
						"message": (receivedErrors as Error).message
					}
				])
			}
		}

		isConnecting.set(false)
	}
	return {
		isConnecting,
		errors,
		send
	}
}
