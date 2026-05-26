import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { Business, Env } from "../../utils/types"

const tableName = "businesses"
const allowedFields: (keyof Business)[] = [
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
const requiredFields: (keyof Business)[] = [
    "business_legal_name",
    "ein",
]

export async function businessRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request, 
        env,
        {
            path: "businesses",
            methods: {
                list: listBusinesses,
                create: createBusiness,
                read: getBusinessById,
                update: patchBusinessById,
                delete: deleteBusinessById
            }
        }
    )
}

async function listBusinesses(
    request: Request, 
    env: Env
): Promise<Response> {
    return httpListRecords<Business>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    );
}

async function createBusiness(
    request: Request, 
    env: Env
): Promise<Response> {
    return httpCreateRecord<Business>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    )
}

async function getBusinessById(
    request: Request, 
    env: Env
): Promise<Response> {
    return httpGetRecordById<Business>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Business to read Not Found"
        }
    );
}

async function patchBusinessById(
    request: Request, 
    env: Env
): Promise<Response> {
    return httpPatchRecordById<Business>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Business to update Not Found"
        }
    );
}

async function deleteBusinessById(
    request: Request, 
    env: Env
): Promise<Response> {
    return httpDeleteRecordById<Business>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Business to delete Not Found"
        }
    )
}

export {
    listBusinesses, 
    createBusiness,
    getBusinessById,
    patchBusinessById,
    deleteBusinessById
}