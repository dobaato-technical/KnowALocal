import { getTourById } from "@/api";
import TourDetailsPage from "@/Views/TourDetails/TourDetailsPage";
import type { Metadata } from "next";

interface TourDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Static generation can be added later by fetching all tour IDs
  return [];
}

export async function generateMetadata({
  params,
}: TourDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tourId = parseInt(resolvedParams.slug, 10);

  if (isNaN(tourId)) {
    return { title: "Invalid Tour | Know A Local" };
  }

  const response = await getTourById(tourId);

  if (!response.success || !response.data) {
    return { title: "Tour Not Found | Know A Local" };
  }

  const tour = response.data;
  return {
    title: `${tour.title} | Know A Local`,
    description: tour.description || undefined,
  };
}

export default async function Page({ params }: TourDetailsPageProps) {
  const resolvedParams = await params;
  const tourId = parseInt(resolvedParams.slug, 10);

  if (isNaN(tourId)) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid Tour ID</h1>
          <p className="text-gray-600">The tour ID must be a number.</p>
        </div>
      </div>
    );
  }

  const response = await getTourById(tourId);

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
