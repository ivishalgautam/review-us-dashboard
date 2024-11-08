"use client";

import React, { useState } from "react";
import { H1, P } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import Link from "next/link";
import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { isObject } from "@/utils/object";
import { toast } from "sonner";

export default function LoginForm({ setIsOtpSent, setPhone }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function loginUser(credentials) {
    setLoading(true);
    try {
      const response = await http().post(
        `${endpoints.auth.login}/customer`,
        credentials,
      );
      setIsOtpSent(true);

      return response.data;
    } catch (error) {
      // console.log(error);
      if (isObject(error)) {
        return toast.error(error.message);
      } else {
        return toast.error("Unable to complete your request.");
      }
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    setPhone(data.phone);
    await loginUser(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start p-8">
        <div className="w-full space-y-6">
          <div className="relative mb-8 before:absolute before:-bottom-5 before:left-0 before:h-1.5 before:w-20 before:bg-black">
            <H1>Login</H1>
          </div>

          {/* phone */}
          <div>
            <Label>Phone</Label>
            <Input
              {...register("phone", {
                required: "required",
              })}
              placeholder="Enter your phone"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
          </div>

          <div>
            <Button className="rounded-full px-12 py-6">
              {loading && (
                <span className="mr-3 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
              )}
              LOGIN
            </Button>
          </div>

          <div className="translate-y-4">
            <P className={"text-center text-sm font-medium tracking-wide"}>
              Do not have an account?{" "}
              <Link href={"/register"} className="text-primary">
                Create one
              </Link>
            </P>
          </div>
        </div>
      </div>
    </form>
  );
}
