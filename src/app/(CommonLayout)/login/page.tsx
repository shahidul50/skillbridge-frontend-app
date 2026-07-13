import { LoginForm } from "@/components/modules/authentication/login-form"
import { Loader } from "@/components/shared/Loader"
import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | SkillBridge",
  description: "Log in to your SkillBridge account to continue your learning journey or manage your tutoring sessions.",
}

function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Suspense fallback={<Loader />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

export default LoginPage
