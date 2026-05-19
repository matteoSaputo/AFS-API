import { webhookRouter } from "../../db/routers";
import { fail } from "../../utils/response";
import { Env } from "../../utils/types";

export async function docusignCompletedRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return webhookRouter(
        request,
        env,
        {
            path: "webhooks/docusign/completed_envelope",
            methods: {
                handler: handleCompletedDocusign
            }
        }
    );
}

async function handleCompletedDocusign(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret")

    if(secret !== env.DOCUSIGN_WEBHOOK_SECRET) {
        return fail("Unauthorized Docusign Webhook", 401);
    }

    let body: any;

    try {
        body = await request.json();
    } catch {
        return fail("Invalid JSON, body", 400)
    }

    const envelopeId = body?.data?.envelopeId ?? 
        body?.envelopeId ?? 
        body?.data?.envelopeSummary?.envelopeId; 

    if(!envelopeId) {
        return fail("Missing envelopeId", 400)
    }

    return Response.json({
        ok: true,
        source: "docusign",
        envelopeId,
        receivedAt: new Date().toISOString()
    });
}