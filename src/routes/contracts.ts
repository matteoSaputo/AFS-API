import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Contract, Env } from "../utils/types"

const tableName = "contracts"
const allowedFields: (keyof Contract)[] = [
    "type",
    "funding_amount",
    "loc_amount",
    "payment_frequency",
    "fee_percent",
    "interest_rate",
    "offer_id", 
    "airtable_id"
]
const requiredFields: (keyof Contract)[] = [
    "offer_id"
]

export async function contractRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "contracts",
            method_functions: {
                list: listContracts,
                create: createContract,
                read: getContractById,
                update: patchContractById,
                delete: deleteContractById
            }
        }
    )
}

async function listContracts(
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

async function createContract(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<Contract>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getContractById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Contract to read Not Found"
        }
    )
}

async function patchContractById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Contract>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Contract to update Not Found"
        }
    )
}

async function deleteContractById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Contract to delete Not Found"
        }
    )
}

export {
    listContracts,
    createContract,
    getContractById,
    patchContractById,
    deleteContractById
}

