export type EnquiryFieldType = "text" | "textarea" | "email" | "tel" | "number" | "date" | "select";

export type EnquiryField = {
  id: string;
  label: string;
  name: string;
  type: EnquiryFieldType;
  placeholder: string;
  required: boolean;
  options: string;
  locked?: boolean;
};

const CORE_NAMES = new Set(["customer_name", "mobile", "email", "address", "message"]);

const NAME_ALIASES: Record<string, string> = {
  name: "customer_name",
  full_name: "customer_name",
  customer_name: "customer_name",
  mobile: "mobile",
  mobile_number: "mobile",
  phone: "mobile",
  phone_number: "mobile",
  email: "email",
  email_address: "email",
  address: "address",
  village: "address",
  message: "message",
  details: "message",
};

export function enquiryFieldId() {
  return `fld-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultEnquiryFields(): EnquiryField[] {
  return [
    {
      id: enquiryFieldId(),
      label: "Full name",
      name: "customer_name",
      type: "text",
      placeholder: "Your full name",
      required: true,
      options: "",
      locked: true,
    },
    {
      id: enquiryFieldId(),
      label: "Mobile number",
      name: "mobile",
      type: "tel",
      placeholder: "10-digit mobile",
      required: true,
      options: "",
      locked: true,
    },
    {
      id: enquiryFieldId(),
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "name@example.com",
      required: false,
      options: "",
    },
    {
      id: enquiryFieldId(),
      label: "Address / village",
      name: "address",
      type: "textarea",
      placeholder: "Village, city, pin",
      required: false,
      options: "",
    },
    {
      id: enquiryFieldId(),
      label: "Details",
      name: "message",
      type: "textarea",
      placeholder: "Tell us what you need",
      required: false,
      options: "",
    },
  ];
}

export function emptyEnquiryField(): EnquiryField {
  return {
    id: enquiryFieldId(),
    label: "",
    name: "",
    type: "text",
    placeholder: "",
    required: false,
    options: "",
  };
}

export function slugFieldKey(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function resolveFieldName(field: Pick<EnquiryField, "label" | "name" | "locked">) {
  if (field.locked && field.name) return field.name;
  const fromLabel = slugFieldKey(field.label);
  const alias = NAME_ALIASES[fromLabel] || NAME_ALIASES[field.name] || "";
  if (alias) return alias;
  const explicit = slugFieldKey(field.name.replace(/^field_/, ""));
  if (CORE_NAMES.has(field.name)) return field.name;
  const key = explicit || fromLabel;
  if (!key) return "";
  if (NAME_ALIASES[key]) return NAME_ALIASES[key];
  if (CORE_NAMES.has(key)) return key;
  return `field_${key}`;
}

export function normalizeEnquiryFields(raw?: EnquiryField[] | null): EnquiryField[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaultEnquiryFields();
  const fields = raw
    .map((field, index) => {
      const label = String(field?.label || "").trim();
      const name = resolveFieldName({
        label,
        name: String(field?.name || ""),
        locked: Boolean(field?.locked),
      });
      return {
        id: String(field?.id || `fld-${index}-${name || "field"}`),
        label,
        name,
        type: (field?.type || "text") as EnquiryFieldType,
        placeholder: String(field?.placeholder || ""),
        required: name === "customer_name" || name === "mobile" ? true : Boolean(field?.required),
        options: String(field?.options || ""),
        locked: name === "customer_name" || name === "mobile",
      };
    })
    .filter((field) => field.label && field.name);

  const names = new Set(fields.map((field) => field.name));
  const missing = defaultEnquiryFields().filter((field) => field.locked && !names.has(field.name));
  return [...missing, ...fields];
}

export function packEnquiryAnswers(form: FormData, fields: EnquiryField[]) {
  const lines: string[] = [];
  for (const field of fields) {
    if (CORE_NAMES.has(field.name)) continue;
    const value = String(form.get(field.name) || "").trim();
    if (!value) continue;
    lines.push(`${field.label}: ${value}`);
    form.delete(field.name);
  }
  if (!lines.length) return;
  const message = String(form.get("message") || "").trim();
  form.set("message", [message, ...lines].filter(Boolean).join("\n"));
}
