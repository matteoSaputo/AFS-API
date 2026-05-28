import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { submissionSchema } from "../../db/schema"
import { Submission, Env } from "../../utils/types"

const schema = submissionSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function submissionRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "submissions",
            methods: {
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
    return httpListRecords<Submission>(
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
    return httpCreateRecord<Submission>(
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
    return httpGetRecordById<Submission>(
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
    return httpPatchRecordById<Submission>(
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
    return httpDeleteRecordById<Submission>(
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

