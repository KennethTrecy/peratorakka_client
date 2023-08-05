import type { GeneralError, RequesterConstraints, RequesterInfo } from "+/rest"

import { get, writable } from "svelte/store"

import { serverURL } from "$/global_state"

import sendJSONRequest from "$/rest/send_json_request"

export default function makeJSONRequester(constraints: RequesterConstraints): RequesterInfo {
	let isConnecting = writable(false)
	let errors = writable<GeneralError[]>([])

	async function send(specialRequestInfo: Partial<Request>) {
		await sendJSONRequest(specialRequestInfo, constraints, {
			isConnecting,
			errors
		})
	}
	return {
		isConnecting,
		errors,
		send
	}
}
