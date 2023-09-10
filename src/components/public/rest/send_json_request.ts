import type {
	GeneralError,
	RequesterConstraints,
	RequesterDependencies,
	RequesterActions
} from "+/rest"

import { get } from "svelte/store"

import { serverURL, accessToken, hasAccessToken, accessTokenMetadata } from "$/global_state"

export default async function sendJSONRequest(
	specialRequestInfo: Partial<Request>,
	constraints: RequesterConstraints,
	dependencies: RequesterDependencies
): Promise<void> {
	const currentServerURL = get(serverURL)
	dependencies.isConnecting.set(true)
	dependencies.errors.set([])

	try {
		const headers = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}

		if (get(hasAccessToken)) {
			headers["Authorization"] = `Bearer ${get(accessToken)}`
			accessTokenMetadata.update(currentAccessTokenMetadata => {
				const newAccessTokenMetadata = new Map(currentAccessTokenMetadata)
				newAccessTokenMetadata.set("lastUsedAt", new Date())
				return newAccessTokenMetadata
			})
		}

		const response = await fetch(`${currentServerURL}${constraints.path}`, {
			"mode": "cors",
			headers,
			...constraints.defaultRequestConfiguration,
			...specialRequestInfo
		})

		const statusCode = response.status
		const caseIndex = constraints.manualResponseHandlers.findIndex(handlerInfo => {
			return handlerInfo.statusCode === statusCode
		})

		if (caseIndex > -1) {
			const caseInfo = constraints.manualResponseHandlers[caseIndex]
			await caseInfo.action(response)
		} else if (constraints.expectedErrorStatusCodes.includes(statusCode)) {
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
