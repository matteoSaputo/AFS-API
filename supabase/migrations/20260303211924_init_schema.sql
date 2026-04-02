begin;

-- For case-insensitive unique email matching later
create extension if not exists citext;

-- ================================================
-- Lookup / references tables
-- ================================================

create table if not exists industries (
    id bigserial primary key,
    industry text not null unique,
    airtable_id varchar(64) unique
);

create table if not exists data_sources (
    id bigserial primary key,
    data_source text not null,
    provider text,
    date_uploaded timestamptz,
    number_of_leads integer check (
        number_of_leads is null or number_of_leads >= 0
    ),
    airtable_id varchar(64) unique
);

create table if not exists offices (
    id bigserial primary key,
    location text not null,
    status varchar(32),
    airtable_id varchar(64) unique,
    manager_id bigint
);

-- ================================================
-- Main entity tables
-- ================================================

create table if not exists merchants (
    id bigserial primary key,
    name text not null,
    ssn varchar(16),
    date_of_birth date,
    address text,
    city varchar(64),
    state char(2),
    zip varchar(16),
    email citext,
    phone varchar(32),
    credit_score integer check (
        credit_score is null or credit_score between 300 and 850
    ),
    bad_history text
);

create table if not exists businesses (
    id bigserial primary key,
    business_legal_name text not null,
    dba text,
    ein varchar(32) not null,
    entity_type varchar(32),
    address text,
    city varchar(64),
    state char(2),
    zip varchar(16),
    email citext,
    phone varchar(32),
    average_monthly_revenue numeric(12, 2) check (
        average_monthly_revenue is null or average_monthly_revenue >= 0
    ),
    start_date date,
    number_of_positions integer check (
        number_of_positions is null or number_of_positions >= 0
    ),
    description text,
    industry_id bigint references industries(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    airtable_id varchar(64) unique
);

create table if not exists lenders (
    id bigserial primary key,
    lender text not null,
    product text not null,
    min_revenue numeric(12, 2) check (
        min_revenue is null or min_revenue >= 0
    ),
    min_tib_months integer check (
        min_tib_months is null or min_tib_months >= 0
    ),
    min_positions integer check (
        min_positions is null or min_positions >= 0
    ),
    max_positions integer check (
        max_positions is null
        or min_positions is null
        or (
            max_positions >= 0 
            and max_positions >= min_positions
        )
    ),
    min_credit_score integer check (
        min_credit_score is null 
        or min_credit_score between 300 and 850
    ),
    status varchar(32),
    airtable_id varchar(64) unique
);

create table if not exists conditional_guidelines (
    id bigserial primary key,
    guideline text not null,
    conditional_state char(2),
    conditional_entity_type varchar(32),
    conditional_revenue numeric(12, 2) check (
        conditional_revenue is null or conditional_revenue >= 0
    ),
    conditional_tib_months integer check (
        conditional_tib_months is null or conditional_tib_months >= 0
    ),
    conditional_min_positions integer check (
        conditional_min_positions is null or conditional_min_positions >= 0
    ),
    conditional_max_positions integer check (
        conditional_max_positions is null
        or conditional_min_positions is null
        or (
            conditional_max_positions >= 0
            and conditional_max_positions >= conditional_min_positions
        )
    ),
    conditional_credit_score integer check (
        conditional_credit_score is null 
        or conditional_credit_score between 300 and 850
    ),
    industry_id bigint references industries(id) on delete set null,
    lender_id bigint references lenders(id) on delete cascade,
    airtable_id varchar(64) unique
);

create table if not exists employees (
    id bigserial primary key,
    name text not null,
    email citext,
    phone varchar(32),
    employment_status varchar(32),
    commission_split_percent numeric(5, 2) check (
        commission_split_percent is null
        or (commission_split_percent >= 0 and commission_split_percent <= 100)
    ),
    role varchar(64),
    airtable_id varchar(64) unique,
    office_id bigint references offices(id) on delete set null
);

alter table offices
    add constraint offices_manager_id_fkey
    foreign key (manager_id) references employees(id) on delete set null;

-- ================================================
-- Workflow tables
-- ================================================

create table if not exists packages (
    id bigserial primary key,
    status varchar(64),
    date_received timestamptz,
    centrex_id varchar(64) unique,
    drive_folder_id varchar(64) unique, 
    airtable_id varchar(64) unique,
    owner_ownership_percent integer check (
        owner_ownership_percent is null 
        or (owner_ownership_percent >= 0 and owner_ownership_percent <= 100)
    ),
    co_owner_ownership_percent integer check (
        co_owner_ownership_percent is null
        or (co_owner_ownership_percent >= 0 and co_owner_ownership_percent <= 100)
    ),
    owner_id bigint references merchants(id) on delete set null,
    co_owner_id bigint references merchants(id) on delete set null,
    business_id bigint not null references businesses(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint packages_distinct_owners check (
        owner_id is null or co_owner_id is null or owner_id <> co_owner_id
    )
);

create table if not exists deals (
    id bigserial primary key,
    date_processed timestamptz,
    stage varchar(64),
    status varchar(64),
    airtable_id varchar(64),
    package_id bigint not null references packages(id) on delete cascade,
    data_source_id bigint references data_sources(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists submissions (
    id bigserial primary key,
    date_submitted timestamptz,
    result varchar(64),
    feedback text,
    airtable_id varchar(64) unique,
    deal_id bigint not null references deals(id) on delete cascade,
    lender_id bigint not null references lenders(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists offers (
    id bigserial primary key,
    amount numeric(12, 2) check (
        amount is null or amount >= 0
    ),
    payment_cycles integer check (
        payment_cycles is null or payment_cycles >= 0
    ),
    payment_frequency varchar(32),
    buy_rate numeric(6, 3) check (
        buy_rate is null or buy_rate >= 0
    ),
    sell_rate numeric(6, 3) check (
        sell_rate is null or sell_rate >= 0
    ),
    airtable_id varchar(64) unique,
    submission_id bigint not null references submissions(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists fundings (
    id bigserial primary key,
    date_funded timestamptz,
    points integer check (
        points is null or points >= 0
    ),
    commission_status varchar(32),
    date_lender_paid timestamptz,
    airtable_id varchar(64) unique,
    offer_id bigint not null references offers(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists contracts (
    id bigserial primary key,
    type varchar(32),
    funding_amount numeric(12, 2) check (
        funding_amount is null or funding_amount >= 0    
    ),
    loc_amount numeric(12, 2) check (
        loc_amount is null or loc_amount >= 0
    ),
    payment_frequency varchar(32),
    fee_percent numeric(6, 3) check (
        fee_percent is null or fee_percent >= 0
    ),
    interest_rate numeric(6, 3) check (
        interest_rate is null or interest_rate >= 0
    ),
    airtable_id varchar(64) unique,
    offer_id bigint not null references offers(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists assignments (
    id bigserial primary key,
    deal_role varchar(64) not null,
    deal_id bigint not null references deals(id) on delete cascade,
    employee_id bigint references employees(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- =========================================================
-- Indexes
-- =========================================================

create index if not exists idx_businesses_industry_id on businesses(industry_id);
create index if not exists idx_businesses_business_legal_name on businesses(business_legal_name);
create index if not exists idx_businesses_dba on businesses(dba);

create index if not exists idx_merchants_email on merchants(email);
create index if not exists idx_merchants_name on merchants(name);

create index if not exists idx_packages_business_id on packages(business_id);
create index if not exists idx_packages_owner_id on packages(owner_id);
create index if not exists idx_packages_co_owner_id on packages(co_owner_id);
create index if not exists idx_packages_date_received on packages(date_received);
create index if not exists idx_packages_status on packages(status);

create index if not exists idx_deals_package_id on deals(package_id);
create index if not exists idx_deals_data_source_id on deals(data_source_id);
create index if not exists idx_deals_stage on deals(stage);
create index if not exists idx_deals_status on deals(status);
create index if not exists idx_deals_date_processed on deals(date_processed);

create index if not exists idx_submissions_deal_id on submissions(deal_id);
create index if not exists idx_submissions_lender_id on submissions(lender_id);
create index if not exists idx_submissions_date_submitted on submissions(date_submitted);

create index if not exists idx_offers_submission_id on offers(submission_id);
create index if not exists idx_fundings_offer_id on fundings(offer_id);
create index if not exists idx_fundings_date_funded on fundings(date_funded);

create index if not exists idx_contracts_offer_id on contracts(offer_id);

create index if not exists idx_conditional_guidelines_lender_id on conditional_guidelines(lender_id);
create index if not exists idx_conditional_guidelines_industry_id on conditional_guidelines(industry_id);

create index if not exists idx_employees_office_id on employees(office_id);
create index if not exists idx_offices_manager_id on offices(manager_id);

create index if not exists idx_assignments_deal_id on assignments(deal_id);
create index if not exists idx_assignments_employee_id on assignments(employee_id);

-- =========================================================
-- Updated_at trigger
-- =========================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_businesses_set_updated_at on businesses;
create trigger trg_businesses_set_updated_at
before update on businesses
for each row execute function set_updated_at();

drop trigger if exists trg_packages_set_updated_at on packages;
create trigger trg_packages_set_updated_at
before update on packages
for each row execute function set_updated_at();

drop trigger if exists trg_deals_set_updated_at on deals;
create trigger trg_deals_set_updated_at
before update on deals
for each row execute function set_updated_at();

drop trigger if exists trg_submissions_set_updated_at on submissions;
create trigger trg_submissions_set_updated_at
before update on submissions
for each row execute function set_updated_at();

drop trigger if exists trg_offers_set_updated_at on offers;
create trigger trg_offers_set_updated_at
before update on offers
for each row execute function set_updated_at();

drop trigger if exists trg_fundings_set_updated_at on fundings;
create trigger trg_fundings_set_updated_at
before update on fundings
for each row execute function set_updated_at();

drop trigger if exists trg_contracts_set_updated_at on contracts;
create trigger trg_contracts_set_updated_at
before update on contracts
for each row execute function set_updated_at();

drop trigger if exists trg_assignments_set_updated_at on assignments;
create trigger trg_assignments_set_updated_at
before update on assignments
for each row execute function set_updated_at();

commit;