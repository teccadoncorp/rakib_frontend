import Link from "next/link";

export function Logo({ height = 44 }: { height?: number }) {
  return (
    <Link href="/" className="logo">
      <img
        src="/assets/images/logo.png"
        alt="Uniqueue DigiTech"
        style={{
          height,
          width: "auto",
          maxHeight: height,
          maxWidth: height >= 50 ? 220 : 196,
          background: "#ffffff",
          padding: height >= 50 ? "5px 10px" : "4px 8px",
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Link>
  );
}
