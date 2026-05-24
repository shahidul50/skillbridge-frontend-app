import { RegisterForm } from "@/components/modules/authentication/register-form"
import { Loader } from "@/components/shared/Loader"
import { Suspense } from "react"


function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Suspense fallback={<Loader />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}

export default RegisterPage
