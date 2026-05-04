// ================ DB ===================
export interface Env {
  HYPERDRIVE: Hyperdrive;
};

// ================ Validator ==================
export type Validator<T> = (body: T) => string | null

// ================ Methods ==================
export type CrudMethod = (request: Request, env: Env) => Promise<Response>

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

// ================ Router Config =================
export type RouterConfig = {
  path: string;
  method_functions: {
    create: CrudMethod,
    read: CrudMethod,
    update: CrudMethod,
    delete: CrudMethod,
    list: CrudMethod
  }
}

// ================ Request/Response Bodies ==================
export type Business = {
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

export type Industry = {
  industry?: string | null;
  airtable_id?: string | null;
};

export type Merchant = {
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

export type Office = {
  location?: string | null;
  status?: string | null;
  airtable_id?: string | null;
  manager_id?: number | null
}

export type Employee = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  employment_status?: string | null;
  commission_split_percent?: number | null;
  role?: string | null;
  airtable_id?: string | null;
  office_id?: number | null;
}

export type DataSource = {
  data_source?: string | null;
  provider?: string | null;
  date_uploaded?: string | null;
  number_of_leads?: number | null;
  airtable_id?: string | null;
}

export type Lender = {
  lender?: string | null;
  product?: string | null;
  min_revenue?: number | null;
  min_tib_months?: number | null;
  min_positions?: number | null;
  max_positions?: number | null;
  min_credit_score?: number | null;
  status?: string | null;
  airtable_id?: string | null;
}

export type ConditionalGuideline = {
  guideline?: string | null;
  conditional_state?: string | null;
  conditional_entity_type?: string | null;
  conditional_revenue?: number | null;
  conditional_tib_months?: number | null;
  conditional_min_positions?: number | null;
  conditional_max_positions?: number | null;
  conditional_credit_score?: number | null;
  industry_id?: number | null;
  lender_id?: number | null;
  airtable_id?: string | null;
}

export type Package = {
  status?: string | null;
  date_received?: string | null;
  centrex_id?: string | null;
  drive_folder_id?: string | null;
  airtable_id?: string | null;
  business_id?: number | null;
  owner_id?: number | null;
  co_owner_id?: number | null;
  owner_ownership_percent?: number | null;
  co_owner_ownership_percent?: number | null;  
}

export type Deal = {
  date_processed?: string | null;
  stage?: string | null;
  status?: string | null;
  airtable_id?: string | null;
  package_id?: number | null;
  data_source_id?: number | null;
}

export type Submission = {
  date_submitted?: string | null;
  result?: string | null;
  feedback?: string | null;
  airtable_id?: string | null;
  deal_id?: number | null;
  lender_id?: number | null;
}

export type Offer = {
  amount?: number | null;
  payment_cycles?: number | null;
  payment_frequency?: string | null;
  buy_rate?: number | null;
  sell_rate?: number | null;
  airtable_id?: string | null;
  submission_id?: number | null;
}

export type Contract = {
  type?: string | null;
  funding_amount?: number | null;
  loc_amount?: number | null;
  payment_frequency?: string | null;
  fee_percent?: number | null;
  interest_rate?: number | null;
  airtable_id?: string | null;
  offer_id?: number | null;
}

export type Funding = {
  date_funded?: string | null;
  points?: number | null;
  commission_status?: string | null;
  date_lender_paid?: string | null;
  airtable_id?: string | null;
  offer_id?: number | null;
}

export type Assignment = {
  employee_id?: number | null;
  deal_id?: number | null;
  deal_role?: string | null;
}