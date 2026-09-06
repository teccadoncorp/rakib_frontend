import Link from "next/link";

export function Logo({ height = 52 }: { height?: number }) {
  return (
    <Link href="/" className="logo">
      <img
        src="/assets/images/logo.png"
        alt="Digital Service — Jaynagar digital partner"
        style={{
          height,
          width: "auto",
          maxHeight: height,
          background: "#ffffff",
          padding: height >= 56 ? "6px 12px" : "4px 10px",
          borderRadius: height >= 56 ? 10 : 10,
          boxShadow:
            height >= 56
              ? "0 4px 14px rgba(0,0,0,0.15)"
              : "0 2px 8px rgba(0,0,0,0.06)",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Link>
  );
}
