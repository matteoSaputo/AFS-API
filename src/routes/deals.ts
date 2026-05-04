import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Deal, Env } from "../utils/types"

const tableName = "deals"
const allowedFields: (keyof Deal)[] = [
    "date_processed", 
    "stage",
    "status",
    "airtable_id",
    "package_id",
    "data_source_id"
]
const requiredFields: (keyof Deal)[] = [
    "package_id"
]

export async function dealRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "deals",
            method_functions: {
                list: listDeals,
                create: createDeal,
                read: getDealById,
                update: patchDealById,
                delete: deleteDealById
            }
        }
    )
}

async function listDeals(
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

async function createDeal(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<Deal>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getDealById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Deal to read Not Found"
        }
    )
}

async function patchDealById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Deal>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Deal to update Not Found"
        }
    )
}

async function deleteDealById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Deal to delete Not Found"
        }
    )
}

export {
    listDeals,
    createDeal,
    getDealById,
    patchDealById,
    deleteDealById
}

