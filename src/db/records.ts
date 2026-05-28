import { Client } from "pg";
import { CreateOptions, DeleteOptions, GetByIdOptions, ListOptions, PatchOptions } from "../utils/types";

export async function listRecords<T extends Record<string, any>>(
    client: Client,
    options: ListOptions
): Promise<{ rows: T[], count: number }> {
    const limit = options.limit ?? 25;
    const offset = options.offset ?? 0;

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

    return {
        rows: result.rows as T[],
        count: result.rowCount ?? 0,
    };
}

export async function createRecord<T extends Record<string, any>>(
    client: Client,
    options: CreateOptions<T>
): Promise<T> {
    const body = options.body;

    if (!body) {
        throw new Error("Missing CreateOptions.body");
    }

    const validationError = options.validator?.(body);
    if (validationError) {
        throw new Error(validationError);
    }

    if (options.requiredFields) {
        for (const field of options.requiredFields) {
            if ([undefined, null, ""].includes(body[field])) {
                throw new Error(`${String(field)} is required`)
            }
        }
    }

    const entries = Object.entries(body).filter(
        ([key, value]) =>
            options.allowedFields.includes(key as keyof T) && value !== undefined
    )

    if (entries.length === 0) {
        throw new Error("No valid fields provided")
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

    return result.rows[0];
}

export async function getRecordById<T extends Record<string, any>>(
    client: Client,
    options: GetByIdOptions
): Promise<{ row: T, count: number }> {
    const id = options.id

    if (!id) {
        throw new Error("Missing GetByIdOptions.id")
    }

    const result = await client.query(
        `
            select *
            from ${options.table}
            where id = $1        
        `,
        [id]
    );

    return {
        row: result.rows[0],
        count: result.rowCount ?? 0
    }
}

export async function patchRecordById<T extends Record<string, any>>(
    client: Client,
    options: PatchOptions<T>
): Promise<{ row: T, count: number }> {
    const body = options.body;
    const id = options.id;

    if(!body || !id){
        throw new Error("Missing PatchOptions.body and/or PatchOptions.id")
    }

    const validationError = options.validator?.(body);
    if(validationError){
        throw new Error(validationError)
    }

    const entries = Object.entries(body).filter(
        ([key, value]) => 
            options.allowedFields.includes(key as keyof T) && value !== undefined
    )

    if(entries.length === 0){
        throw new Error("No valid fields provided for update");
    }

    const setClauses = entries.map(
        ([key], index) => `${key} = $${index + 1}`
    )
    const values = entries.map(([, value]) => value);

    const result = await client.query(
        `
            update ${options.table}
            set ${setClauses.join(", ")}
            where id = $${values.length + 1}
            returning *
        `,
        [...values, id]
    );

    return {
        row: result.rows[0],
        count: result.rowCount ?? 0
    }
}

export async function deleteRecordById<T extends Record<string, any>>(
    client: Client,
    options: DeleteOptions
): Promise<{row: T, count: number}> {
    const id = options.id

    if(!id){
        throw new Error("Missing DeleteOptions.id");
    }

    const result = await client.query(
        `
            delete from ${options.table}
            where id = $1
            returning *  
        `,
        [id]
    );

    return {
        row: result.rows[0],
        count: result.rowCount ?? 0
    }
}