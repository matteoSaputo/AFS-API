import type { Env, IndustryBody } from "../utils/types";
import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud";
import { Router } from "../db/routers";

const tableName = "industries"
const allowedFields: (keyof IndustryBody)[] = [
    "industry", 
    "airtable_id"
]
const requiredFields: (keyof IndustryBody)[] = [
    "industry"
]

export async function industryRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "industries",
            method_functions: {
                create: createIndustry,
                read: getIndustryById,
                update: patchIndustryById,
                delete: deleteIndustryById,
                list: listIndustries
            }
        }
    )
}

async function deleteIndustryById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Industry to delete Not Found"
        }
    )
}

async function patchIndustryById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Industry to update Not Found"
        }
    )
}

async function createIndustry(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<IndustryBody>(
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
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Industry to read Not Found"
        }
    )
}

async function listIndustries(
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