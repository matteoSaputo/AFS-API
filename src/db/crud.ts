import { ok, fail } from "../utils/response";
import { CreateOptions, DeleteOptions, GetByIdOptions, ListOptions, PatchOptions } from "../utils/types";
import { makeClient } from "./client";

export async function listRecords(
    request: Request,
    env: Env,
    options: ListOptions
): Promise<Response> {
    const url = new URL(request.url)
    const client = makeClient(env);

    const limit = Number(url.searchParams.get("limit") ?? "25");
    const offset = Number(url.searchParams.get("offset") ?? "0");

    try {
        await client.connect();

        const result = await client.query(
            `
                select *
                from ${options.table}
                order by ${options.orderBy ?? "id desc"}
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

export async function getRecordById(
    request: Request,
    env: Env,
    options: GetByIdOptions
): Promise<Response> {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[2];

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await client.query(
            `
                select *
                from ${options.table}
                where id = $1        
            `,
            [id]
        );

        if(result.rowCount === 0){
            return fail(options.notFoundMessage ?? "Not Found", 404);
        }

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {});
    }
}

export async function createRecord<T extends Record<string, any>>(
    request: Request,
    env: Env,
    options: CreateOptions<T>,
): Promise<Response> {
    if(!options.body){
        try {
            options.body = await request.json<T>();
        } catch {
            return fail("Invalid JSON body", 400)
        } 
    }
    
    const validationError = options.validator?.(options.body);
    if(validationError){
        return fail(validationError, 400)
    }

    if(options.requiredFields){
        for(const field of options.requiredFields){
            if([undefined, null, ""].includes(options.body[field])){
                return fail(`${String(field)} is required`, 400)
            }
        }
    }

    const entries = Object.entries(options.body).filter(
        ([key, value]) => 
            options.allowedFields.includes(key as keyof T) && value !== undefined
    )

    if(entries.length === 0){
        return fail("No valid fields provided");
    }

    const columns = entries.map(
        ([key]) => key
    );
    const placeholders = entries.map(
        (_, index) => `$${index + 1}`
    );
    const values = entries.map(
        ([, value]) => value
    );

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await client.query(
            `
                insert into ${options.table} (
                    ${columns.join(", ")}
                ) 
                values (
                    ${placeholders.join(", ")}
                )
                    returning *
            `,
            values
        );

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {})
    }
}

export async function patchRecordById<T extends Record<string, any>>(
    request: Request,
    env: Env,
    options: PatchOptions<T>,
): Promise<Response> {
    const url = new URL(request.url)
    const id = url.pathname.split("/")[2];

    if(!options.body){
        try {
            options.body = await request.json<T>();
        } catch {
            return fail("Invalid JSON body", 400)
        } 
    }
    
    const validationError = options.validator?.(options.body);
    if(validationError){
        return fail(validationError, 400)
    }

    const entries = Object.entries(options.body).filter(
        ([key, value]) => 
            options.allowedFields.includes(key as keyof T) && value !== undefined
    )

    if(entries.length === 0){
        return fail("No valid fields provided for update");
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
                update ${options.table}
                set ${setClauses.join(", ")}
                where id = $${values.length + 1}
                returning *
            `,
            [...values, id]
        );

        if(result.rowCount === 0){
            return fail(options.notFoundMessage ?? "Not Found", 404)
        }

        return ok(result.rows[0])
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}

export async function deleteRecordById(
    request: Request,
    env: Env,
    options: DeleteOptions
): Promise<Response> {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[2];

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await client.query(
            `
                delete from ${options.table}
                where id = $1
                returning *  
            `,
            [id]
        );

        if(result.rowCount === 0){
            return fail(options.notFoundMessage ?? "Not Found", 404);
        }

        return ok(result.rows[0]);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}