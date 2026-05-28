import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { packageSchema } from "../../db/schema"
import { Package, Env } from "../../utils/types"

const schema = packageSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function packageRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "packages",
            methods: {
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
    return httpListRecords<Package>(
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
    return httpCreateRecord<Package>(
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
    return httpGetRecordById<Package>(
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
    return httpPatchRecordById<Package>(
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
    return httpDeleteRecordById<Package>(
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