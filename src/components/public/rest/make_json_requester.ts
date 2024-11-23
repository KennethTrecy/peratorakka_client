import type { GeneralError, RequesterConstraints, RequesterInfo } from "+/rest"
import type { ContextBundle } from "+/component"

import { getContext } from "svelte"
import { writable } from "svelte/store"

import { GLOBAL_CONTEXT } from "#/contexts"

import sendJSONRequest from "$/rest/send_json_request"

export default function makeJSONRequester(constraints: RequesterConstraints): RequesterInfo {
	const globalContext = constraints.globalContext ?? getContext(GLOBAL_CONTEXT) as ContextBundle
	let isConnecting = writable(false)
	let errors = writable<GeneralError[]>([])

	async function send(specialRequestInfo: Partial<RequestInit>): Promise<void> {
		await sendJSONRequest(specialRequestInfo, constraints, {
			isConnecting,
			errors,
			globalContext
		})
	}
	return {
		globalContext,
		isConnecting,
		errors,
		send
	}
}
