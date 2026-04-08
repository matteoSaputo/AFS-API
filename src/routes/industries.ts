import { makeClient } from "../db/client";
import type { Env, IndustryBody } from "../utils/types";
import { ok, fail } from "../utils/response";

export async function industryRouter(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname
    const method = request.method

    // === CREATE/POST ===
    if(method === "POST"){
        return createIndustry(request, env);
    }

    // === READ/GET ===
    if (method === "GET" ) {
        if(/^\/industries\/\d+$/.test(pathname)){
            return getIndustryById(request, env);
        }

        return listIndustries(request, env);
    }

    // === UPDATE/PATCH ===
    if (method === "PATCH") {
        if(/^\/industries\/\d+$/.test(pathname)){
            return patchIndustryById(request, env)
        }
    }

    // === DELETE ===
    if (method === "DELETE") {
        if(/^\/industries\/\d+$/.test(pathname)){
            return deleteIndustryById(request, env)
        }
    }

    return fail("Method or Endpoint Not Found", 404)
}

async function deleteIndustryById(
    request: Request, 
    env: Env,
): Promise<Response> {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[2];

    const client = makeClient(env);

    try {
        await client.connect()

        const result = await client.query(
            `
                delete from industries
                where id = $1
                returning *
            `,
            [id]
        )

        if(result.rowCount === 0){
            return fail("Industry Not Found", 404);
        }

        return ok(result.rows[0]);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}

async function patchIndustryById(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url)
    const id = url.pathname.split("/")[2];

    let body: IndustryBody;
    try {
        body = await request.json<IndustryBody>();
    } catch {
        return fail("Invalid JSON body", 400);
    }

    const allowedFields: (keyof IndustryBody)[] = [
        "industry",
        "airtable_id"
    ];

    const entries = Object.entries(body).filter(
        ([key, value]) => 
            allowedFields.includes(key as keyof IndustryBody) &&
            value !== undefined
    );

    if(entries.length === 0) {
        return fail("No valid fields provided for update", 400);
    }

    const setClauses = entries.map(
        ([key], index) => `${key} = $${index + 1}`
    )
    const values = entries.map(([, value]) => value);

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await client.query(
            `
                update industries
                set ${setClauses.join(", ")}
                where id = $${values.length + 1}
                returning *
            `,
            [...values, id]
        );

        if(result.rowCount === 0){
            return fail("Industry Not Found", 404)
        }

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 404);
    } finally {
        await client.end().catch(() => {})
    }
}

async function createIndustry(
    request: Request,
    env: Env,
): Promise<Response> {
    let body: IndustryBody

    try {
        body = await request.json<IndustryBody>();
    } catch  {
        return fail("Invalid JSON body", 400)
    }

    if(!body.industry){
        return fail("Industry is required", 400)
    }

    const client = makeClient(env);

    try {
        await client.connect();
        
        const result = await client.query(
            `
                insert into industries (
                    industry,
                    airtable_id
                )
                values ($1, $2)
                returning *
            `,
            [
                body.industry,
                body.airtable_id ?? null
            ]
        );

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {})
    }
}

async function getIndustryById(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[2];

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await client.query(
            `
                select *
                from industries
                where id = $1        
            `,
            [id]
        );

        if(result.rowCount === 0) {
            return fail("Industry Not Found", 404)
        }

        return ok(result.rows[0]);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {});
    }
}

async function listIndustries(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const client = makeClient(env);

    const limit = Number(url.searchParams.get("limit") ?? "25")
    const offset = Number(url.searchParams.get("offset") ?? "0")

    try {
        await client.connect();

        const result = await client.query(
            `
                select *
                from industries
                order by id desc
                limit $1
                offset $2
            `,
            [limit, offset]
        );

        return ok(result.rows, {
            count: result.rowCount,
        });
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}