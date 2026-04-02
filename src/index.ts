import { ok } from "node:assert";
import { error } from "node:console";
import { findPackageJSON } from "node:module";
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

		if(url.pathname === "/businesses" && request.method === "POST"){
			const client = makeClient(env);
			console.log("test")
			try {
				const body = await request.json<{
					business_legal_name?: string,
					ein?: string,
					industry_id?: number | string | null,
					dba?: string | null,
					entity_type?: string | null,
					address?: string | null,
					city?: string | null,
					state?: string | null,
					zip?: string | null,
					email?: string | null,
					phone?: string | null,
					average_monthly_revenue?: number | null,
					start_date?: string | null,
					number_of_positions?: number | null,
					description?: string | null,
					airtable_id?: string | null,
				}>();

				if(!body.business_legal_name || !body.ein){
					return Response.json(
						{
							ok: false,
							error: "business legal name and EIN required"
						},
						{
							status: 400
						}
					);
				}

				await client.connect();

				const result = await client.query(
					`
						insert into businesses (
							business_legal_name,
							ein,
							industry_id,
							dba,
							entity_type,
							address, 
							city, 
							state, 
							zip,
							email,
							phone,
							average_monthly_revenue,
							start_date,
							number_of_positions,
							description,
							airtable_id
						)
						values (
							$1, $2, $3, $4, $5, $6, $7, $8,
        					$9, $10, $11, $12, $13, $14, $15, $16
						)
						returning *
					`,
					[
						body.business_legal_name,
						body.ein,
						body.industry_id ?? null,
						body.dba ?? null,
						body.entity_type ?? null,
						body.address ?? null,
						body.city ?? null,
						body.state ?? null,
						body.zip ?? null,
						body.email ?? null,
						body.phone ?? null,
						body.average_monthly_revenue ?? null,
						body.start_date ?? null,
						body.number_of_positions ?? null,
						body.description ?? null,
						body.airtable_id ?? null
					]
				);

				return Response.json({
					ok: true,
					data: result.rows
				});
			} catch (err: any) {
				return Response.json(
					{
						ok: false,
						error: err?.message ?? String(err),
					},
					{
						status: 500
					}
				);
			} finally {
				await client.end().catch(() => {})
			}
		}

		if (url.pathname === "/businesses" && request.method === "GET" ) {
			const limit = Number(url.searchParams.get("limit") ?? "25")
			const offset = Number(url.searchParams.get("offset") ?? "0")

			const industry_id = url.searchParams.get("industry_id");
			const state = url.searchParams.get("state");
			const city = url.searchParams.get("city")

			const conditions: string[] = []
			const values: any[] = []

			if(industry_id) {
				values.push(industry_id);
				conditions.push(`industry_id = $${values.length}`)
			}

			if(state) {
				values.push(state);
				conditions.push(`state = $${values.length}`);
			}

			if(city) {
				values.push(city);
				conditions.push(`city = $${values.length}`);
			}

			let whereClause = "";
			if(conditions.length > 0){
				whereClause = "where " + conditions.join(" and ")
			}

			const client = makeClient(env);

			try {
				await client.connect();

				const result = await client.query(
					`
						select b.*, i.industry
						from businesses b
						left join industries i on b.industry_id = i.id
						${whereClause}
						order by b.id desc
						limit $${values.length + 1} 
						offset $${values.length + 2}
					`,
					[...values, limit, offset]
				);

				return Response.json({
					ok: true,
					count: result.rowCount,
					data: result.rows
				});
			} catch (err: any) {
				return Response.json(
					{
						ok: false,
						error: err?.message ?? String(err),
					},
					{
						status: 500
					}
				);
			} finally {
				await client.end().catch(() => {})
			}
		}

		if(url.pathname.startsWith("/businesses/")){
			const id = url.pathname.split("/")[2];

			const client = makeClient(env);

			try {
				await client.connect();

				const result = await client.query(
					`
						select b.*, i.industry
						from businesses b
						left join industries i on b.industry_id = i.id
						where b.id = $1		
					`,
					[id]
				);

				if (result.rowCount === 0) {
					return Response.json(
						{
							ok: false,
							error: "Not Found"
						},
						{
							status: 404
						}
					)
				}

				return Response.json({
					ok: true,
					data: result.rows[0]
				});

			} catch (err: any) {
				return Response.json(
					{
						ok: false,
						error: err?.message ?? String(err),
					},
					{
						status: 500
					}
				);
			} finally {
				await client.end().catch(() => {})
			}
		}

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
