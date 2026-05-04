import { makeClient } from "../db/client";
import { fail } from "../utils/response";
import { Env } from "../utils/types";

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

    return fail("Not Found", 404)
}