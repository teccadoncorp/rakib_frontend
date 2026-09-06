import type { UploadFile } from "@/lib/api";

function fileHref(name: string) {
  if (!name) return "";
  if (name.startsWith("http://") || name.startsWith("https://")) return name;
  return `/uploads/${encodeURIComponent(name)}`;
}

export function DeliveryFiles({
  files,
  title = "Completed documents",
  empty,
}: {
  files?: UploadFile[];
  title?: string;
  empty?: string;
}) {
  const items = (files || []).filter((file) => file.name);
  if (items.length === 0) {
    return empty ? <p style={{ fontSize: "0.82rem", color: "var(--slate-500)", marginTop: 8 }}>{empty}</p> : null;
  }

  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        background: "#ecfdf5",
        border: "1px solid #86efac",
      }}
    >
      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {title}
      </div>
      <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((file) => {
          const href = fileHref(file.name);
          const label = file.label || file.name;
          return (
            <li key={`${file.ref || ""}-${file.name}`}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#166534", fontWeight: 700, textDecoration: "none", wordBreak: "break-word" }}
              >
                <i className="fa-solid fa-file-pdf" aria-hidden /> {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
