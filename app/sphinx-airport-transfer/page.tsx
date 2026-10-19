import { AirportTransferPage } from "@/components/AirportTransferPage";
import { serviceMetadata, type SeoProps } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const generateMetadata = serviceMetadata("/sphinx-airport-transfer");
export default function Page(props: SeoProps) { return <AirportTransferPage {...props} airportKey="sphinx" />; }
