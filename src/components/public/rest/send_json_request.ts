import { type Writable } from "svelte/store"
import type {
	RequesterConstraints,
	RequesterDependencies
} from "+/rest"

import { get } from "svelte/store"

export default async function sendJSONRequest(
	specialRequestInfo: Partial<Request>,
	constraints: RequesterConstraints,
	dependencies: RequesterDependencies
): Promise<void> {
	const {
		serverURL,
		hasAccessToken,
		accessToken,
		accessTokenMetadata
	} = dependencies.globalContext as {
		serverURL: Writable<string>
		hasAccessToken: Writable<string>
		accessToken: Writable<string>
		accessTokenMetadata: Writable<unknown>
	}

	const currentServerURL = get(serverURL)
	dependencies.isConnecting.set(true)
	dependencies.errors.set([])

	try {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}

		if (get(hasAccessToken)) {
			headers["Authorization"] = `Bearer ${get(accessToken)}`
			accessTokenMetadata.update(currentAccessTokenMetadata => {
				const newAccessTokenMetadata = new Map(
					currentAccessTokenMetadata as [string, string|Date][]
				)
				newAccessTokenMetadata.set("lastUsedAt", new Date())
				return newAccessTokenMetadata
			})
		}

		const endpoint = typeof constraints.path === "string"
			? constraints.path
			: get(constraints.path)
		const targetURL = `${currentServerURL}${endpoint}`
		const requestInformation = {
			headers,
			...constraints.defaultRequestConfiguration,
			...specialRequestInfo
		}

		const response = await fetch("/api", {
			method: "POST",
			body: JSON.stringify({
				targetURL,
				requestInformation
			})
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
