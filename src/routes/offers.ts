import { createRecord, deleteRecordById, getRecordById, listRecords, patchRecordById } from "../db/crud"
import { Router } from "../db/routers"
import { Offer, Env } from "../utils/types"

const tableName = "offers"
const allowedFields: (keyof Offer)[] = [
    "amount",
    "payment_cycles",
    "payment_frequency",
    "buy_rate",
    "sell_rate",
    "submission_id", 
    "airtable_id"
]
const requiredFields: (keyof Offer)[] = [
    "submission_id"
]

export async function offerRouter(
    request: Request,
    env: Env
): Promise<Response> {
    return Router(
        request,
        env,
        {
            path: "offers",
            method_functions: {
                list: listOffers,
                create: createOffer,
                read: getOfferById,
                update: patchOfferById,
                delete: deleteOfferById
            }
        }
    )
}

async function listOffers(
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

async function createOffer(
    request: Request,
    env: Env,
): Promise<Response> {
    return createRecord<Offer>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            requiredFields: requiredFields
        }
    );
}

async function getOfferById(
    request: Request,
    env: Env
): Promise<Response> {
    return getRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Offer to read Not Found"
        }
    )
}

async function patchOfferById(
    request: Request,
    env: Env
): Promise<Response> {
    return patchRecordById<Offer>(
        request,
        env,
        {
            table: tableName,
            allowedFields: allowedFields,
            notFoundMessage: "Offer to update Not Found"
        }
    )
}

async function deleteOfferById(
    request: Request, 
    env: Env,
): Promise<Response> {
    return deleteRecordById(
        request,
        env,
        {
            table: tableName,
            notFoundMessage: "Offer to delete Not Found"
        }
    )
}

export {
    listOffers,
    createOffer,
    getOfferById,
    patchOfferById,
    deleteOfferById
}

