import type { Env, IndustryBody } from "../utils/types";
import { fail } from "../utils/response";
import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud";

const table = "industries"
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
    const url = new URL(request.url);
    const pathname = url.pathname
    const method = request.method

    // === CREATE/POST ===
    if(method === "POST"){
        return createIndustry(request, env);
    }

    // === READ/GET ===
    if (method === "GET" ) {
        if(/^\/industries\/\d+$/.test(pathname)){
            return getIndustryById(request, env);
        }

        return listIndustries(request, env);
    }

    // === UPDATE/PATCH ===
    if (method === "PATCH") {
        if(/^\/industries\/\d+$/.test(pathname)){
            return patchIndustryById(request, env)
        }
    }

    // === DELETE ===
    if (method === "DELETE") {
        if(/^\/industries\/\d+$/.test(pathname)){
            return deleteIndustryById(request, env)
        }
    }

    return fail("Method or Endpoint Not Found", 404)
}

async function deleteIndustryById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: table,
            notFoundMessage: "Industry to Delete Not Found"
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
            table: table,
            allowedFields: allowedFields,
            notFoundMessage: "Industry to Update Not Found"
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
            table: table,
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
            table: table,
            notFoundMessage: "Industry to Read Not Found"
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
            table: table,
            orderBy: "id desc"
        }
    )
}