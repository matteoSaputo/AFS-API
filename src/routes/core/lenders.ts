import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { lenderSchema } from "../../db/schema"
import { Lender, Env } from "../../utils/types"

const schema = lenderSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function lenderRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "lenders",
            methods: {
                list: listLenders,
                create: createLender,
                read: getLenderById,
                update: patchLenderById,
                delete: deleteLenderById
            }
        }
    )
}

async function listLenders(
    request: Request,
    env: Env
): Promise<Response> {
    return httpListRecords<Lender>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    )
}

async function createLender(
    request: Request,
    env: Env,
): Promise<Response> {
    return httpCreateRecord<Lender>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getLenderById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpGetRecordById<Lender>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Lender to read Not Found"
        }
    )
}

async function patchLenderById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpPatchRecordById<Lender>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Lender to update Not Found"
        }
    )
}

async function deleteLenderById(
    request: Request,
    env: Env,
): Promise<Response> {
    return httpDeleteRecordById<Lender>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Lender to delete Not Found"
        }
    )
}

export {
    listLenders,
    createLender,
    getLenderById,
    patchLenderById,
    deleteLenderById
}

