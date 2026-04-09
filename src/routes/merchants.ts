import { makeClient } from "../db/client";
import type { Env, MerchantBody } from "../utils/types";
import { ok, fail } from "../utils/response";

export async function merchantRouter(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname
    const method = request.method

    // === CREATE/POST ===
    if(method === "POST"){
        return createMerchant(request, env);
    }

    // === READ/GET ===
    if (method === "GET" ) {
        if(/^\/merchants\/\d+$/.test(pathname)){
            return getMerchantById(request, env);
        }

        return listMerchants(request, env);
    }

    // === UPDATE/PATCH ===
    if (method === "PATCH") {
        if(/^\/merchants\/\d+$/.test(pathname)){
            return patchMerchantById(request, env)
        }
    }

    // === DELETE ===
    if (method === "DELETE") {
        if(/^\/merchants\/\d+$/.test(pathname)){
            return deleteMerchantById(request, env)
        }
    }

    return fail("Method or Endpoint Not Found", 404)
}

async function deleteMerchantById(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[2];

    const client = makeClient(env);

    try {
        await client.connect()

        const result = await client.query(
            `
                delete from merchants
                where id = $1
                returning *
            `,
            [id]
        )

        if(result.rowCount === 0){
            return fail("Merchant Not Found", 404);
        }

        return ok(result.rows[0]);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}

async function patchMerchantById(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url)
    const id = url.pathname.split("/")[2];

    let body: MerchantBody;
    try {
        body = await request.json<MerchantBody>();
    } catch {
        return fail("Invalid JSON body", 400);
    }

    const allowedFields: (keyof MerchantBody)[] = [
        "name",
        "ssn",
        "date_of_birth",
        "address",
        "city",
        "state",
        "zip",
        "email",
        "phone",
        "credit_score",
        "bad_history",
    ];

    const entries = Object.entries(body).filter(
        ([key, value]) => 
            allowedFields.includes(key as keyof MerchantBody) &&
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
                update merchants
                set ${setClauses.join(", ")}
                where id = $${values.length + 1}
                returning *
            `,
            [...values, id]
        );

        if(result.rowCount === 0){
            return fail("Merchant Not Found", 500)
        }

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 404);
    } finally {
        await client.end().catch(() => {})
    }
}

async function createMerchant(
    request: Request,
    env: Env
): Promise<Response> {
    let body: MerchantBody
    
    try {
        body = await request.json<MerchantBody>();
    } catch  {
        return fail("Invalid JSON body", 400)
    }

    if(!body.name){
        return fail("Merchant name is required", 400)
    }

    const client = makeClient(env);

    try {
        await client.connect();
        
        const result = await client.query(
            `
                insert into merchants (
                    name,
                    ssn,
                    date_of_birth,
                    address,
                    city,
                    state,
                    zip,
                    email,
                    phone,
                    credit_score,
                    bad_history
                )
                values (
                    $1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11
                )
                returning *
            `,
            [
                body.name,
                body.ssn ?? null,
                body.date_of_birth ?? null,
                body.address ?? null,
                body.city ?? null,
                body.state ?? null,
                body.zip ?? null,
                body.email ?? null,
                body.phone ?? null,
                body.credit_score ?? null,
                body.bad_history ?? null
            ]
        );

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {})
    }
}

async function getMerchantById(
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
                from merchants
                where id = $1        
            `,
            [id]
        );

        if(result.rowCount === 0) {
            return fail("Merchant Not Found", 404)
        }

        return ok(result.rows[0]);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {});
    }  
}

async function listMerchants(
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
                from merchants
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