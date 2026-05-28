import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { employeeSchema } from "../../db/schema"
import { Employee, Env } from "../../utils/types"

const schema = employeeSchema
const tableName = schema.table
const allowedFields = schema.allowed;
const requiredFields = schema.required;

export async function employeeRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return crudRouter(
        request,
        env,
        {
            path: "employees",
            methods: {
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
    return httpListRecords<Employee>(
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
    return httpCreateRecord<Employee>(
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
    return httpGetRecordById<Employee>(
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
    return httpPatchRecordById<Employee>(
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
    return httpDeleteRecordById<Employee>(
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