import type { BusinessBody, Env } from "../utils/types";
import { fail } from "../utils/response";
import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud";

const tableName = "businesses"
const allowedFields: (keyof BusinessBody)[] = [
    "business_legal_name",
    "ein",
    "industry_id",
    "dba",
    "entity_type",
    "address", 
    "city", 
    "state", 
    "zip",
    "email",
    "phone",
    "average_monthly_revenue",
    "start_date",
    "number_of_positions",
    "description",
    "airtable_id"
]
const requiredFields: (keyof BusinessBody)[] = [
    "business_legal_name",
    "ein",
]

export async function businessRouter(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname
    const method = request.method

    // === CREATE/POST ===
    if(method === "POST"){
        return createBusiness(request, env);
    }

    // === READ/GET ===
    if (method === "GET" ) {
        if(/^\/businesses\/\d+$/.test(pathname)){
            return getBusinessById(request, env);
        }

        return listBusinesses(request, env);
    }

    // === UPDATE/PATCH ===
    if (method === "PATCH") {
        if(/^\/businesses\/\d+$/.test(pathname)){
            return patchBusinessById(request, env)
        }
    }
    
    // === DELETE ===
    if (method === "DELETE") {
        if(/^\/businesses\/\d+$/.test(pathname)){
            return deleteBusinessById(request, env)
        }
    }

    return fail("Method or Endpoint Not Found", 404)
}

async function deleteBusinessById(
    request: Request, 
    env: Env
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Business to delete Not Found"
        }
    )
}

async function patchBusinessById(
    request: Request, 
    env: Env
): Promise<Response> {
    return patchRecordById(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Business to update Not Found"
        }
    );
}

async function getBusinessById(
    request: Request, 
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Business to read Not Found"
        }
    );
}

async function listBusinesses(
    request: Request, 
    env: Env
): Promise<Response> {
    return listRecords(
        request,
        env,
        {
            table: tableName
        }
    );
}

async function createBusiness(
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
    )
}