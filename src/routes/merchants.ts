import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Merchant, Env } from "../utils/types"

const tableName = "merchants";
const allowedFields: (keyof Merchant)[] = [
    "name",
    "ssn",
    "date_of_birth",
    "address",
    "city",
    "state",
    "zip",
    "email",
    "phone",
    "credit_score",
    "bad_history",
];
const requiredFields: (keyof Merchant)[] = [
    "name",
];

export async function merchantRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "merchants",
            method_functions: {
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
    return listRecords(
        request,
        env,
        {
            table: tableName,
        }
    );
}

async function createMerchant(
    request: Request,
    env: Env
): Promise<Response> {
    return createRecord<Merchant>(
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
    return getRecordById(
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
    return patchRecordById<Merchant>(
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
    return deleteRecordById(
        request, 
        env,
        {
            table: tableName,
            notFoundMessage: "Merchant to delete Not Found"
        }
    );
}