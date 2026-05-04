import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { DataSource, Env } from "../utils/types"

const tableName = "data_sources"
const allowedFields: (keyof DataSource)[] = [
    "data_source",
    "provider",
    "date_uploaded",
    "number_of_leads",
    "airtable_id"
]
const requiredFields: (keyof DataSource)[] = [
    "data_source"
]

export async function dataSourceRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "data_sources",
            method_functions: {
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
    return listRecords(
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
    return createRecord<DataSource>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getDataSourceById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
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
    return patchRecordById<DataSource>(
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
    return deleteRecordById(
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

