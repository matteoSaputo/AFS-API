import { httpCreateRecord, httpDeleteRecordById, httpGetRecordById, httpListRecords, httpPatchRecordById } from "../../db/crud"
import { crudRouter } from "../../db/routers"
import { Offer, Env } from "../../utils/types"

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
    return crudRouter(
        request,
        env,
        {
            path: "offers",
            methods: {
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
    return httpListRecords<Offer>(
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
    return httpCreateRecord<Offer>(
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
    return httpGetRecordById<Offer>(
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
    return httpPatchRecordById<Offer>(
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
    return httpDeleteRecordById<Offer>(
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

