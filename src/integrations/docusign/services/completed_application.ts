import { makeClient } from "../../../db/client";
import { createRecord } from "../../../db/records";
import { businessSchema, industrySchema, merchantSchema, packageSchema } from "../../../db/schema";
import { Business, Env, Industry, MappedDocusignApplication, Merchant, Package } from "../../../utils/types";

export async function createPackageFromDocusignApplication(
    env: Env,
    mapped: MappedDocusignApplication
) {
    const client = makeClient(env);

    try {
        await client.connect();

        const preexistingPackage = await client.query(
            "select * from packages where docusign_envelope_id = $1",
            [mapped.package.docusign_envelope_id]
        );

        if ((preexistingPackage.rowCount ?? 0) > 0) {
            return {
                existing: true,
                package: preexistingPackage.rows[0],
            };
        }
        
        await client.query("begin");

        const industry = mapped.industryName ? await createRecord<Industry>(client, {
            table: industrySchema.table,
            body: { industry: mapped.industryName },
            allowedFields: industrySchema.allowed,
            requiredFields: industrySchema.required
        }) : null;

        const business = await createRecord<Business>(client, {
            table: businessSchema.table,
            body: {
                ...mapped.business,
                industry_id: industry?.id ?? null,
            },
            allowedFields: businessSchema.allowed,
            requiredFields: businessSchema.required,
        });

        const owner = await createRecord<Merchant>(client, {
            table: merchantSchema.table,
            body: mapped.owner,
            allowedFields: merchantSchema.allowed,
            requiredFields: merchantSchema.required,
        });

        const coOwner = mapped.coOwner ? await createRecord<Merchant>(client, {
            table: merchantSchema.table,
            body: mapped.coOwner,
            allowedFields: merchantSchema.allowed,
            requiredFields: merchantSchema.required,
        }) : null;

        const newPackage = await createRecord<Package>(client, {
            table: packageSchema.table,
            body: {
                ...mapped.package,
                business_id: business.id,
                owner_id: owner.id,
                co_owner_id: coOwner?.id ?? null
            },
            allowedFields: packageSchema.allowed,
            requiredFields: packageSchema.required
        });

        await client.query("commit");

        return {
            industry,
            business,
            owner,
            coOwner,
            package: newPackage
        };

    } catch (error) {
        await client.query("rollback").catch(() => { });
        throw error;
    } finally {
        await client.end().catch(() => { });
    }
}