import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { conditionalGuidelineSchema } from "../../db/schema"
import { ConditionalGuideline, Env } from "../../utils/types"

const schema = conditionalGuidelineSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function conditionalGuidelinesRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "conditional_guidelines",
            methods: {
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
    return httpListRecords<ConditionalGuideline>(
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
    return httpCreateRecord<ConditionalGuideline>(
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
    return httpGetRecordById<ConditionalGuideline>(
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
    return httpPatchRecordById<ConditionalGuideline>(
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
    return httpDeleteRecordById<ConditionalGuideline>(
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