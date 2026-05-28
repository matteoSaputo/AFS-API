import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { fundingSchema } from "../../db/schema"
import { Funding, Env } from "../../utils/types"

const schema = fundingSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

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

