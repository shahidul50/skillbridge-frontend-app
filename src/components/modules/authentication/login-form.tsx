"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner"
import * as zod from "zod";

const formSchema = zod.object({
    email: zod.email("Invalid email"),
    password: zod.string().min(1, "Password is required"),
});

export function LoginForm() {

    const form = useForm({
        defaultValues: { email: "", password: "" },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            const { data, error } = await authClient.signIn.email({
                email: value.email,
                password: value.password,
                callbackURL: "/dashboard"
            });

            console.log("Logging: ", data)

            if (error) toast.error(error.message);
            else toast.success("Welcome Back!");
        },
    })

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0 border-none shadow-2xl ring-1 ring-border">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-10" onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
                        <FieldGroup className="gap-6">
                            <div className="flex flex-col items-center gap-2 text-center mb-4">
                                <h1 className="text-3xl font-bold font-heading">Login</h1>
                                <p className="text-muted-foreground text-sm">Enter credentials to access SkillBridge</p>
                            </div>

                            {/* Email Field */}
                            <form.Field name="email" children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            placeholder="m@example.com"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }} />

                            <form.Field name="password" children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <div className="flex justify-between">
                                            <FieldLabel htmlFor={field.name}>Password</FieldLabel> <Link href="#" className="text-xs text-primary">Forgot Password?</Link></div>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="password"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }} />

                            <div className="flex flex-col gap-3 mt-2">
                                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]} children={([canSubmit, isSubmitting]) => (
                                    <Button type="submit" disabled={!canSubmit} className="w-full h-11 font-bold mt-2">
                                        {isSubmitting ? "Logging in..." : "Sign In"}
                                    </Button>
                                )} />

                                {/* <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full"
                                    onClick={() => handleGoogleLogin()}
                                >
                                    Continue with Google
                                </Button> */}
                            </div>

                            <p className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href="/register" className="text-primary font-bold hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </FieldGroup>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <Image src="/images/sign-up-illustration.png" alt="Login" fill className="object-cover dark:brightness-[0.7]" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}