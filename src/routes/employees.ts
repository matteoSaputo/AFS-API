import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Employee, Env } from "../utils/types"

const tableName = "employees"
const allowedFields: (keyof Employee)[] = [
    "name",
    "email",
    "phone",
    "employment_status",
    "commission_split_percent",
    "role",
    "airtable_id",
    "office_id"
]
const requiredFields: (keyof Employee)[] = [
    "name"
]

export async function employeeRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "employees",
            method_functions: {
                create: createEmployee,
                read: getEmployeeById,
                update: patchEmployeeById,
                delete: deleteEmployeeById,
                list: listEmployees
            }
        }
    )
}

async function listEmployees(
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

async function createEmployee(
    request: Request,
    env: Env
): Promise<Response> {
    return createRecord<Employee>(
        request, 
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    )
}

async function getEmployeeById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Employee to read Not Found"
        }
    )
}

async function patchEmployeeById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Employee>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Employee to update Not Found"
        }
    )
}

async function deleteEmployeeById(
    request: Request,
    env: Env
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Employee to delete Not Found"
        }
    )
}

export {
    listEmployees,
    createEmployee,
    getEmployeeById,
    patchEmployeeById,
    deleteEmployeeById
}