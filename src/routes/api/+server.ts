import { type RequestEvent } from "@sveltejs/kit"
import { type ProxyRequest } from "+/rest"

import { ofetch } from "ofetch"

export async function POST(event: RequestEvent) {
	const proxyRequest = await event.request.json() as ProxyRequest

	const { targetURL, method, body } = proxyRequest

	const response = await ofetch(targetURL, {
		method,
		body
	})

	return response
}
