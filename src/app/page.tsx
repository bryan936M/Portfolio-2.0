import { getPortfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Home } from "@/features/home/Home";
export const metadata = pageMetadata(
  "Software & Generative AI Engineer",
  "Selected work by Bryan Murasira, a full-stack software engineer and generative AI engineer in Kigali, Rwanda.",
);
export default async function HomePage() {
  return <Home portfolio={await getPortfolio()} />;
}
