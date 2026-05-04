import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Assignment, Env } from "../utils/types"

const tableName = "assignments"
const allowedFields: (keyof Assignment)[] = [
    "employee_id", 
    "deal_id",
    "deal_role"
]
const requiredFields: (keyof Assignment)[] = [
    "deal_id",
    "deal_role"
]

export async function assignmentRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "assignments",
            method_functions: {
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
    return listRecords(
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
    return createRecord<Assignment>(
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
    return getRecordById(
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
    return patchRecordById<Assignment>(
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
    return deleteRecordById(
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