"use client";
import React, { useContext, useEffect, useState } from "react";
import { H2 } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { MainContext } from "@/store/context";
import { Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function ProfileForm({ type }) {
  const { user } = useContext(MainContext);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      business_name: "",
      email: "",
      business_link: "",
      mobile_number: "",
    },
  });

  // --- Fetch business info
  const { data: business, isLoading: isBusinessLoading } = useQuery({
    queryKey: ["business"],
    queryFn: () => http().get(endpoints.business.profile),
  });

  // --- Fetch QR (PNG)
  const { data: qr, isLoading: isQRLoading } = useQuery({
    queryKey: ["qr"],
    queryFn: () => http().get(endpoints.reviews.getQRCode),
  });

  // --- Fetch PDF (binary)
  const { data: pdfData, isLoading: isPdfLoading } = useQuery({
    queryKey: ["pdf"],
    queryFn: async () => {
      const response = await http().get(endpoints.reviews.getQRCode, {
        responseType: "arraybuffer",
      });
      return response;
    },
  });
  console.log({ pdfData });
  // Convert PDF buffer → Blob URL
  const [pdfUrl, setPdfUrl] = useState(null);
  useEffect(() => {
    if (!pdfData) return;
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url); // cleanup
  }, [pdfData]);

  // Populate form when data loads
  useEffect(() => {
    if (!business) return;
    setValue("business_name", business.business_name);
    setValue("business_link", business.business_link);
    user && setValue("email", user.email);
    user && setValue("mobile_number", user.mobile_number);
    qr && setValue("qr", `data:image/png;base64,${qr}`);
  }, [business, user, qr, setValue]);

  const qrImage = watch("qr");

  // Download handler
  const handleDownloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${watch("business_name")}-review-card.pdf`;
    a.click();
  };

  return (
    <form onSubmit={handleSubmit(() => {})} className="w-full">
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT SIDE: QR + PDF preview + download button */}
        <div className="flex flex-col items-center gap-4">
          {/* PDF viewer */}
          {isPdfLoading ? (
            <Skeleton className="h-[400px] w-[300px]" />
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="h-[620px] w-[400px] rounded-lg border"
            />
          ) : null}
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="space-y-4 rounded-lg bg-white p-8 drop-shadow-sm">
          <H2 className="mb-4 text-center">Profile Overview</H2>

          <div>
            <Label>Business Name</Label>
            <Input
              disabled={type === "edit"}
              {...register("business_name", { required: "required*" })}
            />
            {errors.business_name && (
              <p className="text-red-500">{errors.business_name.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              disabled={type === "edit"}
              {...register("email", { required: "required*" })}
            />
          </div>

          <div>
            <Label>Business Link</Label>
            <Input
              disabled={type === "edit"}
              {...register("business_link", { required: "required*" })}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              disabled={type === "edit"}
              type="number"
              {...register("mobile_number")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
