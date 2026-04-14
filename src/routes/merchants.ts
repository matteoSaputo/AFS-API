import type { Env, MerchantBody } from "../utils/types";
import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud";
import { Router } from "../db/routers";

const tableName = "merchants";
const allowedFields: (keyof MerchantBody)[] = [
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
const requiredFields: (keyof MerchantBody)[] = [
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
                create: createMerchant,
                read: getMerchantById,
                update: patchMerchantById,
                delete: deleteMerchantById,
                list: listMerchants
            }
        }
    )
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

async function patchMerchantById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Merchant to update Not Found",
        }
    );
}

async function createMerchant(
    request: Request,
    env: Env
): Promise<Response> {
    return createRecord(
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