// ================ DB ===================
export interface Env {
  HYPERDRIVE: Hyperdrive;
};

// ================ Validator ==================
export type Validator<T> = (body: T) => string | null

// ================ Method Options ==================
export type ListOptions = {
  table: string;
  orderBy?: string;
}

export type GetByIdOptions = {
  table: string;
  id?: string | number;
  notFoundMessage?: string;
};

export type DeleteOptions = {
  table: string;
  id?: string | number;
  notFoundMessage?: string;
};

export type CreateOptions<T extends Record<string, any>> = {
  table: string;
  body?: T;
  allowedFields: (keyof T)[];
  requiredFields?: (keyof T)[];
  validator?: Validator<T>;
};

export type PatchOptions<T extends Record<string, any>> = {
  table: string;
  allowedFields: (keyof T)[];
  body?: T;
  id?: string | number;
  notFoundMessage?: string;
  validator?: Validator<T>;
}

// ================ Request/Response Bodies ==================
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
  industry?: string | null;
  airtable_id?: string | null;
};

export type MerchantBody = {
  name?: string | null;
  ssn?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  email?: string | null;
  phone?: string | null;
  credit_score?: number | null;
  bad_history?: string | null;
};