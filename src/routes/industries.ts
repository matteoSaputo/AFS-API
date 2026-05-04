import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Industry, Env } from "../utils/types"

const tableName = "industries"
const allowedFields: (keyof Industry)[] = [
    "industry", 
    "airtable_id"
]
const requiredFields: (keyof Industry)[] = [
    "industry"
]

export async function industryRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "industries",
            method_functions: {
                list: listIndustries,
                create: createIndustry,
                read: getIndustryById,
                update: patchIndustryById,
                delete: deleteIndustryById
            }
        }
    )
}

async function listIndustries(
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

async function createIndustry(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<Industry>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getIndustryById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Industry to read Not Found"
        }
    )
}

async function patchIndustryById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Industry>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Industry to update Not Found"
        }
    )
}

async function deleteIndustryById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Industry to delete Not Found"
        }
    )
}

export {
    listIndustries,
    createIndustry,
    getIndustryById,
    patchIndustryById,
    deleteIndustryById
}

