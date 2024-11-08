import AuthLayout from "@/components/layout/auth-layout";
import AdminLoginForm from "@/components/forms/admin-login";
import BusinessLoginForm from "@/components/forms/business-login";

export default function Page({ params: { role } }) {
  return (
    <AuthLayout>
      {role === "admin" ? <AdminLoginForm /> : <BusinessLoginForm />}
    </AuthLayout>
  );
}
