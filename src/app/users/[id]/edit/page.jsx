import SignUpForm from "@/components/forms/signup";
import React from "react";

export default function EditPage({ params }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-lg">
        <SignUpForm type="edit" id={params.id} isShowFooter={false} />
      </div>
    </div>
  );
}
