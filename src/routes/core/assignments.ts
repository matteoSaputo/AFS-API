import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { assignmentSchema } from "../../db/schema"
import { Assignment, Env } from "../../utils/types"

const schema = assignmentSchema
const tableName = schema.table;
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function assignmentRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "assignments",
            methods: {
                list: listAssignments,
                create: createAssignment,
                read: getAssignmentById,
                update: patchAssignmentById,
                delete: deleteAssignmentById
            }
        }
    )
}

async function listAssignments(
    request: Request,
    env: Env
): Promise<Response> {
    return httpListRecords<Assignment>(
        request,
        env,
        {
            table: tableName,
            orderBy: "id desc"
        }
    )
}

async function createAssignment(
    request: Request,
    env: Env,
): Promise<Response> {
    return httpCreateRecord<Assignment>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getAssignmentById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpGetRecordById<Assignment>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Assignment to read Not Found"
        }
    )
}

async function patchAssignmentById(
    request: Request,
    env: Env
): Promise<Response> {
    return httpPatchRecordById<Assignment>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Assignment to update Not Found"
        }
    )
}

async function deleteAssignmentById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return httpDeleteRecordById<Assignment>(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Assignment to delete Not Found"
        }
    )
}

export {
    listAssignments, 
    createAssignment,
    getAssignmentById,
    patchAssignmentById,
    deleteAssignmentById
}