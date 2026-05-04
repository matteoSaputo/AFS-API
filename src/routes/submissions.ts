import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Submission, Env } from "../utils/types"

const tableName = "submissions"
const allowedFields: (keyof Submission)[] = [
    "date_submitted",
    "result",
    "feedback", 
    "airtable_id",
    "deal_id",
    "lender_id"
]
const requiredFields: (keyof Submission)[] = [
    "deal_id",
    "lender_id"
]

export async function submissionRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "submissions",
            method_functions: {
                list: listSubmissions,
                create: createSubmission,
                read: getSubmissionById,
                update: patchSubmissionById,
                delete: deleteSubmissionById
            }
        }
    )
}

async function listSubmissions(
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

async function createSubmission(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<Submission>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getSubmissionById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Submission to read Not Found"
        }
    )
}

async function patchSubmissionById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Submission>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Submission to update Not Found"
        }
    )
}

async function deleteSubmissionById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Submission to delete Not Found"
        }
    )
}

export {
    listSubmissions,
    createSubmission,
    getSubmissionById,
    patchSubmissionById,
    deleteSubmissionById
}

