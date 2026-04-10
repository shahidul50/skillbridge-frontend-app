"use client"

import * as zod from "zod";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useForm } from "@tanstack/react-form"
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Zod schema with password matching logic
const formSchema = zod.object({
    name: zod.string().min(1, "Name is required"),
    email: zod.email("Invalid email address"),
    password: zod.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: zod.string().min(8, "Confirm your password"),
    role: zod.string().min(1, "Please select a role"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
        validators: {
            onChange: formSchema,
        },
        onSubmit: async ({ value }) => {
            const { data, error } = await authClient.signUp.email({
                email: value.email,
                password: value.password,
                name: value.name,
                callbackURL: "/login",
                role: value.role,
            } as any);

            if (error) {
                toast.error(error.message || "Registration failed!");
            } else {
                toast.success("Account created successfully!");
                form.reset();
            }
        },
    })

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-none shadow-xl">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup className="gap-5">
                            <div className="flex flex-col items-center gap-2 text-center mb-4">
                                <h1 className="text-2xl font-bold font-heading">Create your account</h1>
                                <p className="text-muted-foreground text-sm">
                                    Join SkillBridge to start your learning journey
                                </p>
                            </div>

                            {/* Name Field */}
                            <form.Field name="name" children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            placeholder="Jone Doe"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }} />


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
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }} />



                            {/* Role Field */}
                            <form.Field name="role" children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Register as</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.state.value}
                                            onValueChange={field.handleChange}
                                        >
                                            <SelectTrigger
                                                id={field.name}
                                                aria-invalid={isInvalid}
                                            >
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="STUDENT">Student</SelectItem>
                                                    <SelectItem value="TUTOR">Instructor</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }} />


                            {/* Password Fields Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <form.Field name="password" children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (<Field>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
                                    </Field>)
                                }} />

                                <form.Field name="confirmPassword" children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (<Field>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
                                    </Field>)
                                }} />
                            </div>

                            <div className="flex flex-col gap-3 mt-2">
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <Button type="submit" disabled={!canSubmit} className="w-full font-bold">
                                            {isSubmitting ? "Creating Account..." : "Create Account"}
                                        </Button>
                                    )}
                                />

                                {/* <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full"
                                    onClick={() => console.log("Google Auth")}
                                >
                                    Continue with Google
                                </Button> */}
                            </div>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </FieldGroup>
                    </form>

                    {/* Illustration Side */}
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/images/sign-up-illustration.png"
                            alt="SkillBridge Registration"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
                            width={600}
                            height={800}
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent flex items-end p-8">
                            <p className="text-lg font-medium italic text-foreground">
                                "Empowering learners through expert mentorship."
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <p className="px-6 text-center text-[12px] text-muted-foreground">
                By clicking continue, you agree to our <Link href="#" className="underline">Terms</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
        </div>
    )
}