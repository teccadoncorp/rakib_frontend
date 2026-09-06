import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { TrackForm } from "@/components/TrackForm";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Track Application Status",
  description:
    "Track your Digital Service enquiry or PVC card order with your reference ID (ENQ / PVC) or 10-digit mobile number.",
  path: "/track",
});

type Props = { searchParams: Promise<{ ref?: string }> };

export default async function TrackPage({ searchParams }: Props) {
  const { ref = "" } = await searchParams;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Track Application", path: "/track" },
        ])}
      />
      <PageBanner
        title="Track Application Status"
        subtitle="Enter your Reference ID (e.g. ENQ-20260814-0001) or 10-digit Mobile Number to check live progress."
      />
      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <TrackForm initialRef={ref} />
          </div>
        </div>
      </section>
    </>
  );
}
