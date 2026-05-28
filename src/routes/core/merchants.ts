import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { merchantSchema } from "../../db/schema"
import { Merchant, Env } from "../../utils/types"

const schema = merchantSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function merchantRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "merchants",
            methods: {
                list: listMerchants,                
                create: createMerchant,
                read: getMerchantById,
                update: patchMerchantById,
                delete: deleteMerchantById
            }
        }
    )
}

async function listMerchants(
    request: Request,
    env: Env
): Promise<Response> {
    return httpListRecords<Merchant>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    );
}

async function createMerchant(
    request: Request,
    env: Env
): Promise<Response> {
    return httpCreateRecord<Merchant>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getMerchantById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpGetRecordById<Merchant>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Merchant to read Not Found"
        }
    );
}

async function patchMerchantById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpPatchRecordById<Merchant>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Merchant to update Not Found",
        }
    );
}


async function deleteMerchantById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpDeleteRecordById<Merchant>(
        request, 
        env,
        {
            table: tableName,
            notFoundMessage: "Merchant to delete Not Found"
        }
    );
}

export {
    listMerchants,
    createMerchant,
    getMerchantById,
    patchMerchantById,
    deleteMerchantById
}