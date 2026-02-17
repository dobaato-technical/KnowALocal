import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false to get fresh data immediately (especially after publishing new tours)
  token: process.env.SANITY_API_TOKEN, // Add token for authenticated requests
});
