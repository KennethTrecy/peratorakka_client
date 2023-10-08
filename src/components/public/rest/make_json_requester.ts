import type { GeneralError, RequesterConstraints, RequesterInfo } from "+/rest"
import type { ContextBundle } from "+/component"

import { getContext } from "svelte"
import { writable } from "svelte/store"

import { GLOBAL_CONTEXT } from "#/contexts"

import sendJSONRequest from "$/rest/send_json_request"

export default function makeJSONRequester(constraints: RequesterConstraints): RequesterInfo {
	const globalContext = getContext(GLOBAL_CONTEXT)
	let isConnecting = writable(false)
	let errors = writable<GeneralError[]>([])

	async function send(specialRequestInfo: Partial<Request>) {
		await sendJSONRequest(specialRequestInfo, constraints, {
			isConnecting,
			errors,
			globalContext
		})
	}
	return {
		isConnecting,
		errors,
		send
	}
}
