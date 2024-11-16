import BusinessLoginForm from "@/components/forms/business-login";
import AuthLayout from "@/components/layout/auth-layout";

export default function Home() {
  return (
    <AuthLayout>
      <BusinessLoginForm />
    </AuthLayout>
  );
}
