import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { Funding, Env } from "../../utils/types"

const tableName = "fundings"
const allowedFields: (keyof Funding)[] = [
    "date_funded",
    "points",
    "commission_status",
    "date_lender_paid",
    "offer_id",
    "airtable_id"
]
const requiredFields: (keyof Funding)[] = [
    "offer_id"
]

export async function fundingRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "fundings",
            methods: {
                list: listFundings,
                create: createFunding,
                read: getFundingById,
                update: patchFundingById,
                delete: deleteFundingById
            }
        }
    )
}

async function listFundings(
    request: Request,
    env: Env
): Promise<Response> {
    return httpListRecords<Funding>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    )
}

async function createFunding(
    request: Request,
    env: Env,
): Promise<Response> {
    return httpCreateRecord<Funding>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getFundingById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpGetRecordById<Funding>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Funding to read Not Found"
        }
    )
}

async function patchFundingById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpPatchRecordById<Funding>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Funding to update Not Found"
        }
    )
}

async function deleteFundingById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return httpDeleteRecordById<Funding>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Funding to delete Not Found"
        }
    )
}

export {
    listFundings,
    createFunding,
    getFundingById,
    patchFundingById,
    deleteFundingById
}

