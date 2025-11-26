"use client";
import React, { useCallback, useEffect, useState } from "react";
import { H1, P } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import FileUpload from "../file-uploader";
import Image from "next/image";
import { Loader2, XIcon } from "lucide-react";
import config from "@/config";
import { cn } from "@/lib/utils";
import Spinner from "../Spinner";

export default function SignUpForm({
  id,
  type = "create",
  isShowFooter = true,
}) {
  const [files, setFiles] = useState({
    logo: [],
  });
  const [fileUrls, setFileUrls] = useState({
    logo_urls: [],
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      business_name: "",
      email: "",
      business_link: "",
      mobile_number: "",
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`users`, id],
    queryFn: async () => {
      const { record } = await http().get(`${endpoints.users.getAll}/${id}`);
      return record ?? {};
    },
  });

  async function signUp(data) {
    setLoading(true);
    try {
      const response = await http().post(
        `${endpoints.auth.signup}/business`,
        data,
        true,
      );

      toast.success("Registered successfully, Please check your email.");
      router.push("/");
      return response.data;
    } catch (error) {
      // console.log(error);
      return toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to complete your request!",
      );
    } finally {
      setLoading(false);
    }
  }

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await http().put(`${endpoints.users.getAll}/${id}`, data, true);
    },
    onSuccess: () => {
      toast.success("Updated.");
      router.push("/users?page=1&limit=10");
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const onSubmit = async (data) => {
    if (!fileUrls?.logo_urls?.length && !files.logo.length) {
      return setError("logo", {
        type: "manual",
        message: "Logo is required*",
      });
    }

    const { nationalNumber, countryCallingCode } = parsePhoneNumber(
      data.mobile_number,
    );

    const formData = new FormData();
    files.logo?.forEach((file) => {
      formData.append("logo", file);
    });

    const payload = {
      business_name: data.business_name,
      email: data.email,
      business_link: data.business_link,
      mobile_number: nationalNumber,
      country_code: countryCallingCode,
    };

    Object.entries(payload).forEach(([key, value]) => {
      typeof value === "object"
        ? formData.append(key, JSON.stringify(value))
        : formData.append(key, value);
    });
    if (type === "create") {
      await signUp(formData);
    }
    if (type === "edit") {
      Object.entries(fileUrls).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
      updateMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (type === "edit" && data) {
      setFileUrls((prev) => ({
        ...prev,
        logo_urls: data.logo,
      }));
      reset({ ...data, mobile_number: "+91" + data.mobile_number });
    }
  }, [data, type, reset]);

  const handleLogoChange = useCallback((data) => {
    setFiles((prev) => ({ ...prev, logo: data }));
  }, []);

  if (type === "edit" && isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start p-8">
        <div className="w-full space-y-2">
          <div className="relative mb-8 before:absolute before:-bottom-5 before:left-0 before:h-1.5 before:w-20 before:bg-black">
            <H1>Register</H1>
          </div>

          {/* images */}
          <div className="col-span-full space-y-4">
            <Label>Logo</Label>
            <FileUpload
              onFileChange={handleLogoChange}
              inputName={"logo"}
              className={cn({ "border-red-500": errors.logo })}
              initialFiles={[]}
              multiple={false}
              maxFiles={1}
            />

            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {fileUrls.logo_urls?.map((src, index) => (
                <div
                  className="relative aspect-square w-24 rounded-md bg-accent"
                  key={index}
                >
                  <Image
                    src={`${config.file_base}/${src}`}
                    width={200}
                    height={200}
                    className="size-full rounded-[inherit] object-cover"
                    alt={`logo-${index}`}
                  />
                  <Button
                    onClick={() =>
                      setFileUrls((prev) => ({
                        ...prev,
                        logo_urls: prev.logo_urls.filter((i) => i !== src),
                      }))
                    }
                    size="icon"
                    className="absolute -right-2 -top-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                    aria-label="Remove image"
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* name */}
          <div>
            <Label>Business Name</Label>
            <Input
              {...register("business_name", {
                required: "required*",
              })}
              placeholder="Enter Your business name"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
            {errors.business_name && (
              <span className="text-red-500">
                {errors.business_name.message}
              </span>
            )}
          </div>

          {/* email */}
          <div>
            <Label>Email</Label>
            <Input
              {...register("email", {
                required: "required*",
              })}
              placeholder="Enter Your Email"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* google review link */}
          <div>
            <Label>Google review link</Label>
            <Input
              {...register("business_link", {
                required: "required*",
              })}
              placeholder="Enter google review link"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
            {errors.business_link && (
              <span className="text-red-500">
                {errors.business_link.message}
              </span>
            )}
          </div>

          {/* contact number */}
          <div>
            <Label>Contact number</Label>
            <Controller
              control={control}
              name="mobile_number"
              rules={{
                required: "required*",
                validate: (value) =>
                  isValidPhoneNumber(value) || "Invalid phone number",
              }}
              render={({ field }) => (
                <PhoneInputWithCountrySelect
                  placeholder="Enter phone number"
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="IN"
                />
              )}
            />
            {errors.mobile_number && (
              <span className="text-red-500">
                {errors.mobile_number.message}
              </span>
            )}
          </div>

          <div className="!mt-6 text-end">
            <Button className="w-full rounded-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />} Submit
            </Button>
          </div>

          {isShowFooter && (
            <div className="translate-y-4">
              <P className={"text-center text-sm font-medium tracking-wide"}>
                Already have an account?{" "}
                <Link href={"/"} className="text-primary">
                  Login
                </Link>
              </P>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
