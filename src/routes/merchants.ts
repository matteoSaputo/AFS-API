import type { Env, MerchantBody } from "../utils/types";
import { fail } from "../utils/response";
import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud";

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
    const url = new URL(request.url);
    const pathname = url.pathname
    const method = request.method

    // === CREATE/POST ===
    if(method === "POST"){
        return createMerchant(request, env);
    }

    // === READ/GET ===
    if (method === "GET" ) {
        if(/^\/merchants\/\d+$/.test(pathname)){
            return getMerchantById(request, env);
        }

        return listMerchants(request, env);
    }

    // === UPDATE/PATCH ===
    if (method === "PATCH") {
        if(/^\/merchants\/\d+$/.test(pathname)){
            return patchMerchantById(request, env)
        }
    }

    // === DELETE ===
    if (method === "DELETE") {
        if(/^\/merchants\/\d+$/.test(pathname)){
            return deleteMerchantById(request, env)
        }
    }

    return fail("Method or Endpoint Not Found", 404)
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