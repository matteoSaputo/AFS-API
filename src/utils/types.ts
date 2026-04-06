export interface Env {
  HYPERDRIVE: Hyperdrive;
};

export type BusinessBody = {
  business_legal_name?: string | null;
  dba?: string | null;
  ein?: string | null;
  entity_type?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  email?: string | null;
  phone?: string | null;
  average_monthly_revenue?: number | null;
  start_date?: string | null;
  number_of_positions?: number | null;
  description?: string | null;
  industry_id?: number | null;
  airtable_id?: string | null;
};

export type IndustryBody = {
  industry?: string | null,
  airtable_id?: string | null;
}