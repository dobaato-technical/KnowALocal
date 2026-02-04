import { toursMockData } from "@/Views/TourDetails/data/mock";
import TourDetailsPage from "@/Views/TourDetails/TourDetailsPage";

interface TourDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return toursMockData.flatMap((tour) => [
    { slug: tour.slug },
    { slug: tour.id.toString() },
  ]);
}

export default async function Page({ params }: TourDetailsPageProps) {
  const resolvedParams = await params;
  return <TourDetailsPage params={resolvedParams} />;
}
