import { webhookRouter } from "../../db/routers";
import { docusignGetRecipients, docusignGetTabsForRecipient } from "../../integrations/docusign/client";
import { mapDocusignApplication } from "../../integrations/docusign/mapper";
import { tabsToRawObject } from "../../integrations/docusign/parser";
import { getDocusignToken } from "../../integrations/docusign/token";
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

    if (secret !== env.DOCUSIGN_WEBHOOK_SECRET) {
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

    if (!envelopeId) {
        return fail("Missing envelopeId", 400)
    }

    try {
        const token = await getDocusignToken(env);

        const recipients = await docusignGetRecipients({
            baseUri: token.baseUri,
            accountId: token.accountId,
            envelopeId,
            accessToken: token.accessToken
        });

        const signers = recipients.signers || [];
        const rawObjects = [];

        for (const signer of signers) {
            if (!signer.recipientId) continue;

            const tabs = await docusignGetTabsForRecipient({
                baseUri: token.baseUri,
                accountId: token.accountId,
                envelopeId,
                recipientId: signer.recipientId,
                accessToken: token.accessToken
            });

            rawObjects.push(tabsToRawObject(tabs))
        }

        const raw = Object.assign({}, ...rawObjects);

        const mapped = mapDocusignApplication(raw)

        return Response.json({
            ok: true,
            source: "docusign",
            envelopeId,
            signerCount: signers.length,
            fieldsFound: Object.keys(raw).length,
            raw,
            mapped,
            receivedAt: new Date().toISOString()
        });
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    }
}