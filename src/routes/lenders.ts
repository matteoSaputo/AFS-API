import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Lender, Env } from "../utils/types"

const tableName = "lenders"
const allowedFields: (keyof Lender)[] = [
    "lender",
    "product",
    "min_revenue",
    "min_tib_months",
    "min_positions",
    "max_positions",
    "min_credit_score",
    "status", 
    "airtable_id"
]
const requiredFields: (keyof Lender)[] = [
    "lender",
    "product",
]

export async function lenderRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "lenders",
            method_functions: {
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
    return listRecords(
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
    return createRecord<Lender>(
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
    return getRecordById(
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
    return patchRecordById<Lender>(
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
    return deleteRecordById(
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

