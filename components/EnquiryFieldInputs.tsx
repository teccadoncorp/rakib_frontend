import type { EnquiryField } from "@/lib/enquiry-fields";

export function EnquiryFieldInputs({
  fields,
  idPrefix,
  defaults,
}: {
  fields: EnquiryField[];
  idPrefix: string;
  defaults?: Partial<Record<string, string>>;
}) {
  return (
    <>
      {fields.map((field) => {
        const id = `${idPrefix}-${field.name}`;
        const label = (
          <label className="form-label" htmlFor={id}>
            {field.label} {field.required ? <span style={{ color: "red" }}>*</span> : null}
          </label>
        );
        if (field.type === "textarea") {
          return (
            <div className="form-group" key={field.id}>
              {label}
              <textarea
                id={id}
                name={field.name}
                className="form-control"
                rows={field.name === "message" ? 4 : 2}
                required={field.required}
                placeholder={field.placeholder}
                defaultValue={defaults?.[field.name] || ""}
              />
            </div>
          );
        }
        if (field.type === "select") {
          const options = field.options.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
          return (
            <div className="form-group" key={field.id}>
              {label}
              <select id={id} name={field.name} className="form-control" required={field.required} defaultValue={defaults?.[field.name] || ""}>
                <option value="">{field.placeholder || "Select"}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return (
          <div className="form-group" key={field.id}>
            {label}
            <input
              id={id}
              name={field.name}
              type={field.type === "tel" ? "tel" : field.type}
              className="form-control"
              required={field.required}
              placeholder={field.placeholder}
              defaultValue={defaults?.[field.name] || ""}
              inputMode={field.name === "mobile" || field.type === "tel" ? "numeric" : undefined}
              pattern={field.name === "mobile" ? "[0-9]{10}" : undefined}
            />
          </div>
        );
      })}
    </>
  );
}
