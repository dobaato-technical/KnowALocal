import { getTourBySlug } from "@/api/tours/tours";
import TourDetailsPage from "@/Views/TourDetails/TourDetailsPage";

interface TourDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Static generation can be added later by fetching all tour slugs
  return [];
}

export default async function Page({ params }: TourDetailsPageProps) {
  const resolvedParams = await params;
  const response = await getTourBySlug(resolvedParams.slug);

  if (!response.success || !response.data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Tour Not Found</h1>
          <p className="text-gray-600">
            The tour you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <TourDetailsPage tour={response.data} />;
}
