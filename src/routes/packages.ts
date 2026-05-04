import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Package, Env } from "../utils/types"

const tableName = "packages"
const allowedFields: (keyof Package)[] = [
    "status",
    "date_received",
    "centrex_id",
    "drive_folder_id", 
    "airtable_id",
    "business_id",
    "owner_id",
    "co_owner_id",
    "owner_ownership_percent",
    "co_owner_ownership_percent"
]
const requiredFields: (keyof Package)[] = [
    "business_id"
]

export async function packageRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "packages",
            method_functions: {
                list: listPackages,
                create: createPackage,
                read: getPackageById,
                update: patchPackageById,
                delete: deletePackageById
            }
        }
    )
}

async function listPackages(
    request: Request,
    env: Env
): Promise<Response> {
    return listRecords(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    )
}

async function createPackage(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<Package>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getPackageById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Package to read Not Found"
        }
    )
}

async function patchPackageById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Package>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Package to update Not Found"
        }
    )
}

async function deletePackageById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Package to delete Not Found"
        }
    )
}

export {
    listPackages,
    createPackage,
    getPackageById,
    patchPackageById,
    deletePackageById
}