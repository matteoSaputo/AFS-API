import { makeClient } from "../../db/client";
import { fail, ok } from "../../utils/response";
import { Env } from "../../utils/types";

export async function debugRouter(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);

    if(url.pathname === "/debug/ping") {
        const client = makeClient(env)

        try {
            await client.connect();
            const result = await client.query(`select now() as now`);
            return Response.json({
                ok: true,
                now: result.rows[0].now
            })
        } catch (err: any) {
            return Response.json({
                ok: false,
                error: err?.message ?? String(err),
                name: err?.name,
                code: err?.code
            },
            {
                status: 500
            }
            )
        } finally {
            await client.end().catch(() => {})
        }
    }

    if(url.pathname === "/debug/bindings") {
        return Response.json({
            envKeys: Object.keys(env || {}),
            hyperdrive: {
                present: env?.HYPERDRIVE != null,
            }
        });
    }

    if(url.pathname === "/debug/where") {
        const cs = env.HYPERDRIVE.connectionString;
        return Response.json({
            hostKind: cs.includes("hyperdrive.local") ? "hyperdrive" : "direct"
        })
    }

    if(url.pathname === "/debug/docusign_private_key") {
        return ok(debugDocusignPrivateKey(env))
    }

    return fail("Not Found", 404)
}

export function debugDocusignPrivateKey(env: Env) {
  const raw = env.DOCUSIGN_PRIVATE_KEY || "";
  const normalized = raw.replace(/\\n/g, "\n").trim();

  const pemBody = normalized
    .replace(/-----BEGIN [A-Z ]+-----/g, "")
    .replace(/-----END [A-Z ]+-----/g, "")
    .replace(/\s+/g, "");

  return {
    hasKey: !!raw,
    beginsWith: normalized.slice(0, 40),
    containsPkcs8: normalized.includes("BEGIN PRIVATE KEY"),
    containsPkcs1: normalized.includes("BEGIN RSA PRIVATE KEY"),
    rawLength: raw.length,
    normalizedLength: normalized.length,
    pemBodyLength: pemBody.length,
    pemBodyStarts: pemBody.slice(0, 10),
    pemBodyLooksBase64: /^[A-Za-z0-9+/=]+$/.test(pemBody),
  };
}