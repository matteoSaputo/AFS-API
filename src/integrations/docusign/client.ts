import { AllDocusignRecipients, DocusignTabs } from "../../utils/types";

export async function docusignGetRecipients({
    baseUri,
    accountId,
    envelopeId,
    accessToken,
}: {
    baseUri: string;
    accountId: string;
    envelopeId: string;
    accessToken: string;
}): Promise<AllDocusignRecipients> {
    const url = `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/recipients`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        throw new Error(`DocuSign recipients error: ${res.status} ${await res.text()}`);
    }

    return res.json() as Promise<AllDocusignRecipients>;
}

export async function docusignGetTabsForRecipient({
    baseUri,
    accountId,
    envelopeId,
    recipientId,
    accessToken,
}: {
    baseUri: string;
    accountId: string;
    envelopeId: string;
    recipientId: string;
    accessToken: string;
}): Promise<DocusignTabs> {
    const url = `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/recipients/${recipientId}/tabs`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        throw new Error(`DocuSign tabs error: ${res.status} ${await res.text()}`);
    }

    return res.json() as Promise<DocusignTabs>;
}