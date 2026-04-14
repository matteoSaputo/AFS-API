import type { BusinessBody, Env } from "../utils/types";
import { fail } from "../utils/response";
import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud";
import { Router } from "../db/routers";

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
    return Router(
        request, 
        env,
        {
            path: "businesses",
            method_functions: {
                create: createBusiness,
                read: getBusinessById,
                update: patchBusinessById,
                delete: deleteBusinessById,
                list: listBusinesses
            }
        }
    )
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