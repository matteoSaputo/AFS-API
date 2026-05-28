// ================ DB ===================
export interface Env {
  HYPERDRIVE: Hyperdrive;
  API_KEY: string;

  DOCUSIGN_CLIENT_ID: string;
  DOCUSIGN_USER_ID: string;
  DOCUSIGN_PRIVATE_KEY: string;
  DOCUSIGN_ACCOUNT_ID: string;
  DOCUSIGN_BASE_URI: string;
  DOCUSIGN_WEBHOOK_SECRET: string;

  AIRTABLE_PAT: string;
  AIRTABLE_BASE_ID: string;
};

// ================ Validator ==================
export type Validator<T> = (body: T) => string | null

// ================ Methods ==================
export type ResponseMethod = (request: Request, env: Env) => Promise<Response>

export type ListOptions = {
  table: string;
  orderBy?: string;
  limit?: number | string;
  offset?: number | string;
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
  allowedFields: readonly (keyof T)[];
  requiredFields?: readonly (keyof T)[];
  validator?: Validator<T>;
};

export type PatchOptions<T extends Record<string, any>> = {
  table: string;
  allowedFields: readonly (keyof T)[];
  body?: T;
  id?: string | number;
  notFoundMessage?: string;
  validator?: Validator<T>;
}

// ================ Router Config =================
export type RouterConfig<T extends Record<string, ResponseMethod>> = {
  path: string;
  methods: T
}

export type Crud = {
  create: ResponseMethod,
  read: ResponseMethod,
  update: ResponseMethod,
  delete: ResponseMethod,
  list: ResponseMethod
}

export type Webhook = {
  handler: ResponseMethod
}

// ================ Docusign ===================
export interface DocusignRecipient {
  recipientId: string;
  name?: string;
  email?: string;
}

export interface AllDocusignRecipients {
  signers?: DocusignRecipient[];
}

export interface DocusignTabs {
  textTabs?: any[];
  emailTabs?: any[];
  numberTabs?: any[];
  ssnTabs?: any[];
  dateTabs?: any[];
  zipTabs?: any[];
  phoneNumberTabs?: any[];
  listTabs?: any[];
}

// ================ DB Core Schema Objects ==================
import type {
  InferRecord,
  assignmentSchema,
  businessSchema,
  conditionalGuidelineSchema,
  contractSchema,
  dataSourceSchema,
  dealSchema,
  employeeSchema,
  fundingSchema,
  industrySchema,
  lenderSchema,
  merchantSchema,
  officeSchema,
  offerSchema,
  packageSchema,
  submissionSchema,
} from "../db/schema";

export type Business = InferRecord<typeof businessSchema>;
export type Industry = InferRecord<typeof industrySchema>;
export type Merchant = InferRecord<typeof merchantSchema>;
export type Office = InferRecord<typeof officeSchema>;
export type Employee = InferRecord<typeof employeeSchema>;
export type DataSource = InferRecord<typeof dataSourceSchema>;
export type Lender = InferRecord<typeof lenderSchema>;
export type ConditionalGuideline = InferRecord<typeof conditionalGuidelineSchema>;
export type Package = InferRecord<typeof packageSchema>;
export type Deal = InferRecord<typeof dealSchema>;
export type Submission = InferRecord<typeof submissionSchema>;
export type Offer = InferRecord<typeof offerSchema>;
export type Contract = InferRecord<typeof contractSchema>;
export type Funding = InferRecord<typeof fundingSchema>;
export type Assignment = InferRecord<typeof assignmentSchema>;