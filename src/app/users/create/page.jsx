import SignUpForm from "@/components/forms/signup";
import React from "react";

export default function Page() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-lg">
        <SignUpForm type="create" isShowFooter={false} />
      </div>
    </div>
  );
}
