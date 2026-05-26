import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { Contract, Env } from "../../utils/types"

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
    return crudRouter(
        request,
        env,
        {
            path: "contracts",
            methods: {
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
    return httpListRecords<Contract>(
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
    return httpCreateRecord<Contract>(
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
    return httpGetRecordById<Contract>(
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
    return httpPatchRecordById<Contract>(
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
    return httpDeleteRecordById<Contract>(
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

