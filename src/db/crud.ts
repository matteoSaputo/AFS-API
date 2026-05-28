import { ok, fail } from "../utils/response";
import { CreateOptions, DeleteOptions, Env, GetByIdOptions, ListOptions, PatchOptions } from "../utils/types";
import { makeClient } from "./client";
import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "./records";

export async function httpListRecords<T extends Record<string, any>>(
    request: Request,
    env: Env,
    options: ListOptions
): Promise<Response> {
    const url = new URL(request.url)
    const client = makeClient(env);

    const limit = options.limit ?? Number(url.searchParams.get("limit") ?? "25");
    const offset = options.offset ?? Number(url.searchParams.get("offset") ?? "0");

    try {
        await client.connect();

        const result = await listRecords<T>(client, {
            ...options,
            limit,
            offset
        })

        return ok(result.rows, {
            count: result.count,
        });
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}

export async function httpGetRecordById<T extends Record<string, any>>(
    request: Request,
    env: Env,
    options: GetByIdOptions
): Promise<Response> {
    let id: string;
    if(options.id){
        id = String(options.id)
    }else{
        const url = new URL(request.url);
        id = url.pathname.split("/")[2];
    }   

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await getRecordById<T>(client, {
            ...options,
            id
        })

        if(result.count === 0){
            return fail(options.notFoundMessage ?? "Not Found", 404);
        }

        return ok(result.row)
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {});
    }
}

export async function httpCreateRecord<T extends Record<string, any>>(
    request: Request,
    env: Env,
    options: CreateOptions<T>,
): Promise<Response> {
    let body: T
    if(options.body){
        body = options.body
    }else{
        try {
            body = await request.json<T>();
        } catch {
            return fail("Invalid JSON body", 400)
        }    
    }
    
    const client = makeClient(env);

    try {
        await client.connect();

        const row = await createRecord<T>(client, {
            ...options,
            body
        });

        return ok(row);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500)
    } finally {
        await client.end().catch(() => {})
    }
}

export async function httpPatchRecordById<T extends Record<string, any>>(
    request: Request,
    env: Env,
    options: PatchOptions<T>,
): Promise<Response> {
    let id: string;
    if(options.id){
        id = String(options.id)
    }else{
        const url = new URL(request.url);
        id = url.pathname.split("/")[2];
    }   

    let body: T
    if(options.body){
        body = options.body
    }else{
        try {
            body = await request.json<T>();
        } catch {
            return fail("Invalid JSON body", 400)
        }    
    }

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await patchRecordById<T>(client, {
            ...options,
            body,
            id
        });

        if(result.count === 0){
            return fail(options.notFoundMessage ?? "Not Found", 404)
        }

        return ok(result.row);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}

export async function httpDeleteRecordById<T extends Record<string, any>>(
    request: Request,
    env: Env,
    options: DeleteOptions
): Promise<Response> {
    let id: string;
    if(options.id){
        id = String(options.id)
    }else{
        const url = new URL(request.url);
        id = url.pathname.split("/")[2];
    }   

    const client = makeClient(env);

    try {
        await client.connect();

        const result = await deleteRecordById<T>(client, {
            ...options,
            id
        })

        if(result.count === 0){
            return fail(options.notFoundMessage ?? "Not Found", 404);
        }

        return ok(result.row);
    } catch (err: any) {
        return fail(err?.message ?? String(err), 500);
    } finally {
        await client.end().catch(() => {})
    }
}