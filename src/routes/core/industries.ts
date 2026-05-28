import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { industrySchema } from "../../db/schema"
import { Industry, Env } from "../../utils/types"

const schema = industrySchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function industryRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "industries",
            methods: {
                list: listIndustries,
                create: createIndustry,
                read: getIndustryById,
                update: patchIndustryById,
                delete: deleteIndustryById
            }
        }
    )
}

async function listIndustries(
    request: Request,
    env: Env
): Promise<Response> {
    return httpListRecords<Industry>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    )
}

async function createIndustry(
    request: Request,
    env: Env,
): Promise<Response> {
    return httpCreateRecord<Industry>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getIndustryById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpGetRecordById<Industry>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Industry to read Not Found"
        }
    )
}

async function patchIndustryById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpPatchRecordById<Industry>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Industry to update Not Found"
        }
    )
}

async function deleteIndustryById(
    request: Request,
    env: Env,
): Promise<Response> {
    return httpDeleteRecordById<Industry>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Industry to delete Not Found"
        }
    )
}

export {
    listIndustries,
    createIndustry,
    getIndustryById,
    patchIndustryById,
    deleteIndustryById
}

