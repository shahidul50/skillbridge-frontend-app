"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useForm } from "@tanstack/react-form";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { getTutorDetailsByUserId, updateTutorAction } from "@/actions/tutor.action";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2 } from "lucide-react";

// Zod Schema
const profileSchema = zod.object({
  name: zod.string().min(3, "Full name is required"),
  title: zod.string().min(5, "Professional title is required"),
  phoneNumber: zod.string().optional(),
  bio: zod.string().min(20, "Bio must be at least 20 characters"),
  experience: zod.string().min(1, "Experience is required"),
  hourlyRate: zod.string().min(1, "Hourly rate is required"),
  profilePhoto: zod.any().optional(),
});

type ProfileFormValues = zod.infer<typeof profileSchema>;

export const TutorProfileForm = () => {
  const [tutor, setTutor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      title: "",
      phoneNumber: "",
      bio: "",
      experience: "",
      hourlyRate: "",
      profilePhoto: undefined,
    } as ProfileFormValues,
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      setIsUpdating(true);
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("title", value.title);
        formData.append("phoneNumber", value.phoneNumber || "");
        formData.append("bio", value.bio);
        formData.append("experience", value.experience);
        formData.append("hourlyRate", value.hourlyRate);

        if (value.profilePhoto instanceof File) {
          formData.append("avatar", value.profilePhoto);
        }

        const res = await updateTutorAction(formData);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Profile updated successfully");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsUpdating(false);
      }
    },
  });

  useEffect(() => {
    const fetchTutorData = async () => {
      setIsLoading(true);
      const res = await getTutorDetailsByUserId();
      if (res.data) {
        const data = res.data;
        setTutor(data);
        form.setFieldValue("name", data.user?.name || "");
        form.setFieldValue("title", data.title || "");
        form.setFieldValue("phoneNumber", data.user?.phoneNumber || "");
        form.setFieldValue("bio", data.bio || "");
        form.setFieldValue("experience", data.experience?.toString() || "");
        form.setFieldValue("hourlyRate", data.hourlyRate?.toString() || "");
        if (data.user?.image) {
          setPreviewImage(data.user.image);
        }
      } else if (res.error) {
        toast.error(res.error);
      }
      setIsLoading(false);
    };

    fetchTutorData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-[#22c55e]" />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
      <CardHeader className="space-y-1 pb-8 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-2xl font-bold">Edit Profile Information</CardTitle>
        <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
          Update your public profile and session pricing.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8 space-y-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-10"
        >
          {/* Profile Photo Section */}
          <form.Field
            name="profilePhoto"
            children={(field) => (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="size-24 border-2 border-white dark:border-zinc-950 shadow-sm">
                    <AvatarImage src={previewImage || "/images/avatar-placeholder.png"} alt="Profile" />
                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      {form.getFieldValue("name")?.substring(0, 2).toUpperCase() || "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    id="profilePhoto"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.handleChange(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => document.getElementById("profilePhoto")?.click()}
                    className="absolute bottom-0 right-0 size-8 rounded-full bg-[#22c55e] hover:bg-[#1eb054] text-white border-2 border-white dark:border-zinc-950 shadow-sm transition-all"
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Profile Photo</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                    JPG, GIF or PNG. Max size of 2MB. A clear professional photo helps you stand out to students.
                  </p>
                  <div className="flex items-center gap-4 justify-center sm:justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => document.getElementById("profilePhoto")?.click()}
                      className="text-sm font-semibold text-[#22c55e] hover:underline transition-all"
                    >
                      Upload new photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        field.handleChange(undefined);
                        setPreviewImage(tutor?.profilePhoto || null);
                      }}
                      className="text-sm font-semibold text-red-500 hover:underline transition-all"
                    >
                      Reset
                    </button>
                  </div>
                  {field.state.meta.errors && <FieldError errors={field.state.meta.errors} />}
                </div>
              </div>
            )}
          />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGroup className="md:col-span-2">
              <form.Field
                name="name"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name} className="text-sm font-bold">Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="e.g. John Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              />
            </FieldGroup>

            <form.Field
              name="title"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-sm font-bold">Professional Title</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. Physics Specialist"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="phoneNumber"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-sm font-bold">Phone Number</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="+1 (555) 123-4567"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="bio"
              children={(field) => (
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor={field.name} className="text-sm font-bold">Professional Bio</FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder="Write something about your experience..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-[120px] p-4 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 resize-none"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="experience"
              children={(field) => (
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor={field.name} className="text-sm font-bold">Years of Experience</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="10"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                  />
                  <p className="text-xs text-zinc-400">Total years of teaching or professional practice.</p>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <div className="space-y-6 md:col-span-2 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
              <form.Field
                name="hourlyRate"
                children={(field) => (
                  <Field className="w-full md:max-w-[320px]">
                    <FieldLabel htmlFor={field.name} className="text-sm font-bold">Hourly Rate</FieldLabel>
                    <InputGroup className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden">
                      <InputGroupAddon>
                        <InputGroupText>৳</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id={field.name}
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="pl-0 text-base font-semibold"
                      />
                    </InputGroup>
                    <p className="text-xs text-zinc-400">Adjust your rate for new booking requests.</p>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              />

              <div className="flex flex-col gap-3 min-w-[240px] text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex justify-between items-center">
                  <span>Account Created On:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {tutor?.createdAt ? new Date(tutor.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Updated:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {tutor?.updatedAt ? new Date(tutor.updatedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              className="rounded-xl px-8 h-12 font-bold text-zinc-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="rounded-xl px-8 h-12 font-bold bg-[#22c55e] hover:bg-[#1eb054] text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

