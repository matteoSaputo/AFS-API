import type { Env } from "../../utils/types";

let cachedToken: string | null = null;
let cachedExp = 0;

function base64url(input: string | ArrayBuffer) {
  return btoa(
    typeof input === "string"
      ? input
      : String.fromCharCode(...new Uint8Array(input))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function importPrivateKey(pem: string) {
  pem = pem.replace(/\\n/g, "\n").trim();

  const pemBody = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, "")
    .replace(/-----END [A-Z ]+-----/g, "")
    .replace(/\s+/g, "");

  const der = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export async function getDocusignToken(env: Env) {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && cachedExp - now > 300) {
    return {
      accessToken: cachedToken,
      baseUri: env.DOCUSIGN_BASE_URI,
      accountId: env.DOCUSIGN_ACCOUNT_ID,
      cached: true,
    };
  }

  const header = { alg: "RS256", typ: "JWT" };

  const payload = {
    iss: env.DOCUSIGN_CLIENT_ID,
    sub: env.DOCUSIGN_USER_ID,
    aud: "account.docusign.com",
    iat: now,
    exp: now + 3600,
    scope: "signature impersonation",
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await importPrivateKey(env.DOCUSIGN_PRIVATE_KEY);

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${base64url(signature)}`;

  const res = await fetch("https://account.docusign.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error(`DocuSign token error: ${res.status} ${await res.text()}`);
  }

  const json: any = await res.json();

  cachedToken = json.access_token;
  cachedExp = now + json.expires_in;

  return {
    accessToken: json.access_token,
    baseUri: env.DOCUSIGN_BASE_URI,
    accountId: env.DOCUSIGN_ACCOUNT_ID,
    cached: false,
  };
}