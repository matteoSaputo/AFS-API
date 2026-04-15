import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Office, Env } from "../utils/types"

const tableName = "offices"
const allowedFields: (keyof Office)[] = [
    "location",
    "status",
    "airtable_id",
    "manager_id"
]
const requiredFields: (keyof Office)[] = [
    "location"
]

export async function officesRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "offices",
            method_functions: {
                list: listOffices,
                create: createOffice,
                read: getOfficeById,
                update: patchOfficeById,
                delete: deleteOfficeById
            }
        }
    )
}

async function listOffices(
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

async function createOffice(
    request: Request,
    env: Env
): Promise<Response> {
    return createRecord<Office>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getOfficeById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Office to read Not Found"
        }
    );
}

async function patchOfficeById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Office>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Office to update Not Found",
        }
    );
}

async function deleteOfficeById(
    request: Request,
    env: Env
): Promise<Response> {
    return deleteRecordById(
        request, 
        env,
        {
            table: tableName,
            notFoundMessage: "Office to delete Not Found"
        }
    );
}