import { cleanState, cleanString, digitsOnly, parseNumber, parseUsDate } from "../../utils/parse";

export function mapDocusignApplication(raw: Record<string, string>) {
  return {
    industryName: cleanString(raw["Business Industry"]),

    business: {
      business_legal_name: cleanString(raw["Legal Name"]),
      ein: digitsOnly(raw["EIN"]),
      entity_type: cleanString(raw["Entity Type"]),
      address: cleanString(raw["Business Address"]),
      city: cleanString(raw["Business City"]),
      state: cleanState(raw["Business State"]),
      zip: cleanString(raw["Business Zip"]),
      email: cleanString(raw["Business Email"]),
      phone: digitsOnly(raw["Business Phone"]),
      description: cleanString(raw["Business Description"]),
      start_date: parseUsDate(raw["Start Date"]),
    },

    owner: {
      name: cleanString(raw["Owner Name"]),
      ssn: digitsOnly(raw["Owner SSN"]),
      date_of_birth: parseUsDate(raw["Owner Date of Birth"]),
      address: cleanString(raw["Owner Address"]),
      city: cleanString(raw["Owner City"]),
      state: cleanState(raw["Owner State"]),
      zip: cleanString(raw["Owner Zip"]),
      email: cleanString(raw["Owner Email"]),
      phone: digitsOnly(raw["Owner Phone"]),
      credit_score: parseNumber(raw["Owner Credit Score"]),
    },

    coOwner: cleanString(raw["Co-Owner Name"])
      ? {
          name: cleanString(raw["Co-Owner Name"]),
          ssn: digitsOnly(raw["Co-Owner SSN"]),
          date_of_birth: parseUsDate(raw["Co-Owner Date of Birth"]),
          email: cleanString(raw["Co-Owner Email"]),
          phone: digitsOnly(raw["Co-Owner Phone"]),
          credit_score: parseNumber(raw["Co-Owner Credit Score"]),
        }
      : null,

    package: {
      status: "Sent",
      date_received: new Date().toISOString().slice(0, 10),
      owner_ownership_percent: parseNumber(raw["Owner Ownership Percent"]),
      co_owner_ownership_percent: parseNumber(raw["Co-Owner Ownership Percent"]),
      docusign_envelope_id: cleanString(raw["docusign_envelope_id"])
    },
  };
}