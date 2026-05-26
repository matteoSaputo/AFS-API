import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { Deal, Env } from "../../utils/types"

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
    return crudRouter(
        request,
        env,
        {
            path: "deals",
            methods: {
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
    return httpListRecords<Deal>(
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
    return httpCreateRecord<Deal>(
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
    return httpGetRecordById<Deal>(
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
    return httpPatchRecordById<Deal>(
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
    return httpDeleteRecordById<Deal>(
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

