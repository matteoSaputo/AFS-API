import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { ConditionalGuideline, Env } from "../utils/types"

const tableName = "conditional_guidelines"
const allowedFields: (keyof ConditionalGuideline)[] = [
    "guideline",
    "conditional_state",
    "conditional_entity_type",
    "conditional_revenue",
    "conditional_tib_months",
    "conditional_min_positions",
    "conditional_max_positions",
    "conditional_credit_score",
    "industry_id",
    "lender_id", 
    "airtable_id"
]
const requiredFields: (keyof ConditionalGuideline)[] = [
    "guideline"
]

export async function conditionalGuidelinesRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "conditional_guidelines",
            method_functions: {
                list: listConditionalGuidelines,
                create: createConditionalGuideline,
                read: getConditionalGuidelineById,
                update: patchConditionalGuidelineById,
                delete: deleteConditionalGuidelineById
            }
        }
    )
}

async function listConditionalGuidelines(
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

async function createConditionalGuideline(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<ConditionalGuideline>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getConditionalGuidelineById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Conditional Guideline to read Not Found"
        }
    )
}

async function patchConditionalGuidelineById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<ConditionalGuideline>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Conditional Guideline to update Not Found"
        }
    )
}

async function deleteConditionalGuidelineById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Conditional Guideline to delete Not Found"
        }
    )
}

export {
    listConditionalGuidelines,
    createConditionalGuideline,
    getConditionalGuidelineById,
    patchConditionalGuidelineById,
    deleteConditionalGuidelineById
}