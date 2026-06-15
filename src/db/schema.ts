export type FieldType = "string" | "number";
export type FieldValue<T extends FieldType> = T extends "number" ? number | null : string | null;
export type TableFields = Record<string, FieldType>;

export type TableSchema<F extends TableFields> = {
    table: string,
    fields: F,
    allowed: readonly (keyof F)[],
    required?: readonly (keyof F)[]
};

export function defineTableSchema<const F extends TableFields>(
    schema: {
        table: string,
        fields: F,
        required?: readonly (keyof F)[]
    },
): TableSchema<F> {
    return {
        ...schema,
        allowed: Object.keys(schema.fields) as (keyof F)[]
    }
}

export type InferRecord<T extends TableSchema<any>> = {
    id?: number;
    created_at?: string,
    updated_at?: string
} & {
    [K in keyof T["fields"]]?: FieldValue<T["fields"][K]>;
};

export const businessSchema = defineTableSchema({
    table: "businesses",
    fields: {
        business_legal_name: "string",
        dba: "string",
        ein: "string",
        entity_type: "string",
        address: "string",
        city: "string",
        state: "string",
        zip: "string",
        email: "string",
        phone: "string",
        average_monthly_revenue: "number",
        start_date: "string",
        number_of_positions: "number",
        description: "string",
        industry_id: "number",
        airtable_id: "string",
    },
    required: ["business_legal_name", "ein"],
});

export const industrySchema = defineTableSchema({
    table: "industries",
    fields: {
        industry: "string",
        airtable_id: "string",
    },
    required: ["industry"],
});

export const merchantSchema = defineTableSchema({
    table: "merchants",
    fields: {
        name: "string",
        ssn: "string",
        date_of_birth: "string",
        address: "string",
        city: "string",
        state: "string",
        zip: "string",
        email: "string",
        phone: "string",
        credit_score: "number",
        bad_history: "string",
    },
    required: ["name"],
});

export const officeSchema = defineTableSchema({
    table: "offices",
    fields: {
        location: "string",
        status: "string",
        airtable_id: "string",
        manager_id: "number",
    },
    required: ["location"],
});

export const employeeSchema = defineTableSchema({
    table: "employees",
    fields: {
        name: "string",
        email: "string",
        phone: "string",
        employment_status: "string",
        commission_split_percent: "number",
        role: "string",
        airtable_id: "string",
        office_id: "number",
    },
    required: ["name"],
});

export const dataSourceSchema = defineTableSchema({
    table: "data_sources",
    fields: {
        data_source: "string",
        provider: "string",
        date_uploaded: "string",
        number_of_leads: "number",
        airtable_id: "string",
    },
    required: ["data_source"],
});

export const lenderSchema = defineTableSchema({
    table: "lenders",
    fields: {
        lender: "string",
        product: "string",
        min_revenue: "number",
        min_tib_months: "number",
        min_positions: "number",
        max_positions: "number",
        min_credit_score: "number",
        status: "string",
        airtable_id: "string",
    },
    required: ["lender", "product"],
});

export const conditionalGuidelineSchema = defineTableSchema({
    table: "conditional_guidelines",
    fields: {
        guideline: "string",
        conditional_state: "string",
        conditional_entity_type: "string",
        conditional_revenue: "number",
        conditional_tib_months: "number",
        conditional_min_positions: "number",
        conditional_max_positions: "number",
        conditional_credit_score: "number",
        industry_id: "number",
        lender_id: "number",
        airtable_id: "string",
    },
    required: ["guideline"],
});

export const packageSchema = defineTableSchema({
    table: "packages",
    fields: {
        status: "string",
        date_received: "string",
        centrex_id: "string",
        drive_folder_id: "string",
        airtable_id: "string",
        business_id: "number",
        owner_id: "number",
        co_owner_id: "number",
        owner_ownership_percent: "number",
        co_owner_ownership_percent: "number",
        docusign_envelope_id: "string",
    },
    required: ["business_id"],
});

export const dealSchema = defineTableSchema({
    table: "deals",
    fields: {
        date_processed: "string",
        stage: "string",
        status: "string",
        airtable_id: "string",
        package_id: "number",
        data_source_id: "number",
    },
    required: ["package_id"],
});

export const submissionSchema = defineTableSchema({
    table: "submissions",
    fields: {
        date_submitted: "string",
        result: "string",
        feedback: "string",
        airtable_id: "string",
        deal_id: "number",
        lender_id: "number",
    },
    required: ["deal_id", "lender_id"],
});

export const offerSchema = defineTableSchema({
    table: "offers",
    fields: {
        amount: "number",
        payment_cycles: "number",
        payment_frequency: "string",
        buy_rate: "number",
        sell_rate: "number",
        airtable_id: "string",
        submission_id: "number",
    },
    required: ["submission_id"],
});

export const contractSchema = defineTableSchema({
    table: "contracts",
    fields: {
        type: "string",
        funding_amount: "number",
        loc_amount: "number",
        payment_frequency: "string",
        fee_percent: "number",
        interest_rate: "number",
        airtable_id: "string",
        offer_id: "number",
    },
    required: ["offer_id"],
})

export const fundingSchema = defineTableSchema({
    table: "fundings",
    fields: {
        date_funded: "string",
        points: "number",
        commission_status: "string",
        date_lender_paid: "string",
        airtable_id: "string",
        offer_id: "number",
    },
    required: ["offer_id"],
});

export const assignmentSchema = defineTableSchema({
    table: "assignments",
    fields: {
        employee_id: "number",
        deal_id: "number",
        deal_role: "string",
    },
    required: ["deal_id", "deal_role"],
});