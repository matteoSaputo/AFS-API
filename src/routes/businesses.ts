import type { BusinessBody, Env } from "../utils/types";
import { makeClient } from "../db/client";
import { ok, fail } from "../utils/response";

export async function businessRouter(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname
    const method = request.method

    // === CREATE/POST ===
    if(method === "POST"){
        return createBusiness(request, env);
    }

    // === READ/GET ===
    if (method === "GET" ) {
        if(/^\/businesses\/\d+$/.test(pathname)){
            return getBusinessById(request, env);
        }

        return listBusinesses(request, env);
    }

    // === UPDATE/PATCH ===
    if (method === "PATCH") {
        if(/^\/businesses\/\d+$/.test(pathname)){
            return patchBusinessById(request, env)
        }
    }
    
    // === DELETE ===
    if (method === "DELETE") {
        if(/^\/businesses\/\d+$/.test(pathname)){
            return deleteBusinessById(request, env)
        }
    }

    return fail("Method or Endpoint Not Found", 404)
}

async function deleteBusinessById(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const id = url.pathname.split("/")[2];

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await client.query(
            `
                delete from businesses
                where id = $1
                returning *
            `,
            [id]
        );

        if(result.rowCount === 0){
            return fail("Business Not Found", 404);
        }

        return ok(result.rows[0]);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {});
    }
}

async function patchBusinessById(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const id = url.pathname.split("/")[2];

    let body: BusinessBody;
    try {
        body = await request.json<BusinessBody>();
    } catch {
        return fail("Invalid JSON body");
    }

    const allowedFields: (keyof BusinessBody)[] = [
        "business_legal_name",
        "ein",
        "industry_id",
        "dba",
        "entity_type",
        "address", 
        "city", 
        "state", 
        "zip",
        "email",
        "phone",
        "average_monthly_revenue",
        "start_date",
        "number_of_positions",
        "description",
        "airtable_id"
    ]

    const entries = Object.entries(body).filter(
        ([key, value]) => 
            allowedFields.includes(key as keyof BusinessBody) && 
            value !== undefined
    );

    if(entries.length === 0) {
        return fail("No valid fields provided for update", 400);
    }

    const setClauses = entries.map(
        ([key], index) => `${key} = $${index + 1}`
    );
    const values = entries.map(([, value]) => value)

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await client.query(
            `
                update businesses
                set ${setClauses.join(", ")}
                where id = $${values.length + 1}
                returning *
            `,
            [...values, id]
        );

        if(result.rowCount === 0) {
            return fail("Business Not Found", 404);
        }

        return ok(result.rows[0]);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {});
    }
}

async function getBusinessById(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
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
            return fail("Not Found", 404)
        }

        return ok(result.rows[0])

    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {})
    }
}

async function listBusinesses(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const client = makeClient(env);

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

        return ok(result.rows, {
            count: result.rowCount
        })
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {})
    }
}

async function createBusiness(request: Request, env: Env): Promise<Response> {
    const client = makeClient(env);

    try {
        const body = await request.json<BusinessBody>();

        if(!body.business_legal_name || !body.ein){
            return fail("business legal name and EIN required", 400)
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

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {})
    }
}