import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { officeSchema } from "../../db/schema"
import { Office, Env } from "../../utils/types"

const schema = officeSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function officesRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "offices",
            methods: {
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
    return httpListRecords<Office>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    );
}

async function createOffice(
    request: Request,
    env: Env
): Promise<Response> {
    return httpCreateRecord<Office>(
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
    return httpGetRecordById<Office>(
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
    return httpPatchRecordById<Office>(
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
    return httpDeleteRecordById<Office>(
        request, 
        env,
        {
            table: tableName,
            notFoundMessage: "Office to delete Not Found"
        }
    );
}

export {
    listOffices,
    createOffice,
    getOfficeById,
    patchOfficeById,
    deleteOfficeById
}