"use client";
import ReviewForm from "@/components/forms/review";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ReviewForm />
    </Suspense>
  );
}
