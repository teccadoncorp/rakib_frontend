import { permanentRedirect } from "next/navigation";
import { getService } from "@/lib/data";

type Props = { searchParams: Promise<{ slug?: string }> };

export default async function LegacyServiceDetailsPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  permanentRedirect(`/services/${getService(slug).slug}`);
}
