import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function deleteReview({ id }) {
  return await http().delete(`${endpoints.reviews.getAll}/${id}`);
}

export async function fetchreviews(params) {
  return await http().get(`${endpoints.reviews.getAll}?${params}`);
}
