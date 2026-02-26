import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nmbcunlrijwkvqoakqkr.supabase.co";
const serviceRoleKey =
  "YDRtflkkLw6XRtCE";

const supabase = createClient(supabaseUrl, serviceRoleKey);

const tours = [
  {
    title: "Everest Base Camp Trek",
    short_desc: "Trek to the base of the world's highest mountain",
    long_desc: "Experience the Himalayas on this iconic trek",
    price: 1500,
    duration: "14 days",
    difficulty: "Hard",
    rating: 4.8,
    featured: true,
    tour_type: "trekking",
  },
  {
    title: "Kathmandu Valley Tour",
    short_desc: "Explore ancient temples and culture",
    long_desc: "Visit historic temples of Kathmandu Valley",
    price: 800,
    duration: "3 days",
    difficulty: "Easy",
    rating: 4.6,
    featured: true,
    tour_type: "cultural",
  },
  {
    title: "Pokhara Adventure",
    short_desc: "Lakes, mountains and outdoor activities",
    long_desc: "Experience adventure in the lakeside city",
    price: 600,
    duration: "4 days",
    difficulty: "Medium",
    rating: 4.7,
    featured: false,
    tour_type: "adventure",
  },
];

async function insertTours() {
  try {
    const { data, error } = await supabase.from("tours").insert(tours);

    if (error) {
      console.error("Error inserting tours:", error);
      return;
    }

    console.log("Tours inserted successfully:", data);

    // Verify by querying
    const { data: toursData, error: selectError } = await supabase
      .from("tours")
      .select("*");

    if (selectError) {
      console.error("Error fetching tours:", selectError);
      return;
    }

    console.log("Total tours in database:", toursData?.length);
    console.log("Tours:", toursData);
  } catch (err) {
    console.error("Exception:", err);
  }
}

insertTours();
