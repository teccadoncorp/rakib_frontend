import type { UploadFile } from "@/lib/api";

function fileHref(name: string) {
  if (!name) return "";
  if (name.startsWith("http://") || name.startsWith("https://")) return name;
  return `/uploads/${encodeURIComponent(name)}`;
}

function isImage(name: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name);
}

export function AdminFiles({ files, empty = "No files uploaded." }: { files?: UploadFile[] | string[]; empty?: string }) {
  const items: UploadFile[] = (files || []).map((entry) =>
    typeof entry === "string" ? { name: entry, label: entry } : entry
  ).filter((item) => item.name);

  if (items.length === 0) {
    return <p className="ap-muted">{empty}</p>;
  }

  return (
    <ul className="ap-files">
      {items.map((file) => {
        const href = fileHref(file.name);
        const label = file.label || file.name;
        return (
          <li key={`${file.ref || ""}-${file.name}`} className="ap-file">
            {isImage(file.name) ? (
              <a href={href} target="_blank" rel="noreferrer">
                <img src={href} alt={label} />
              </a>
            ) : (
              <a href={href} target="_blank" rel="noreferrer">
                <i className="fa-solid fa-file-lines" aria-hidden /> {label}
              </a>
            )}
            <a href={href} target="_blank" rel="noreferrer">{label}</a>
            {file.ref ? <span className="ap-muted">{file.ref}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}
