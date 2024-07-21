import { type RequestEvent } from "@sveltejs/kit"
import { type ProxyRequest } from "+/rest"

import { ofetch } from "ofetch"

export async function POST(event: RequestEvent) {
	const proxyRequest = await event.request.json() as ProxyRequest

	const { targetURL, requestInformation } = proxyRequest

	const response = await ofetch(targetURL, requestInformation)

	return new Response(JSON.stringify(response))
}
