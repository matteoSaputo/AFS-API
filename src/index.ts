import { Client } from "pg";

export interface Env {
	HYPERDRIVE: Hyperdrive;
}

function makeClient(env: Env) {
	const cs = env.HYPERDRIVE.connectionString;
	const isHyperdrive = cs.includes(".hyperdrive.local");

	return new Client({
		connectionString: cs,
		...(isHyperdrive ? {} : {
			ssl: {
				rejectUnauthorized: false
			}
		})
	})
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		if(url.pathname === "/health") {
			const hasHyperdrive = !!env.HYPERDRIVE;
			return Response.json({
				ok : true,
				hasHyperdrive
			});
		}

		if(url.pathname === "/db/ping") {
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
					// conn: env?.HYPERDRIVE?.connectionString?.slice(0, 128) ?? null
				}
			});
		}

		if(url.pathname === "/debug/where") {
			const cs = env.HYPERDRIVE.connectionString;
			return Response.json({
				hostKind: cs.includes("hyperdrive.local") ? "hyperdrive" : "direct"
			})
		}

		return new Response("Not Found", {
			status: 404
		});
	},
} satisfies ExportedHandler<Env>;
