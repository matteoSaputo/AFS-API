import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { dataSourceSchema } from "../../db/schema"
import { DataSource, Env } from "../../utils/types"

const schema = dataSourceSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function dataSourceRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "data_sources",
            methods: {
                list: listDataSources,
                create: createDataSource,
                read: getDataSourceById,
                update: patchDataSourceById,
                delete: deleteDataSourceById
            }
        }
    )
}

async function listDataSources(
    request: Request,
    env: Env
): Promise<Response> {
    return httpListRecords<DataSource>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    )
}

async function createDataSource(
    request: Request,
    env: Env,
): Promise<Response> {
    return httpCreateRecord<DataSource>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getDataSourceById<DataSource>(
    request: Request,
    env: Env
): Promise<Response> {
    return httpGetRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Data Source to read Not Found"
        }
    )
}

async function patchDataSourceById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpPatchRecordById<DataSource>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Data Source to update Not Found"
        }
    )
}

async function deleteDataSourceById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return httpDeleteRecordById<DataSource>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Data Source to delete Not Found"
        }
    )
}

export {
    listDataSources,
    createDataSource,
    getDataSourceById,
    patchDataSourceById,
    deleteDataSourceById
}

