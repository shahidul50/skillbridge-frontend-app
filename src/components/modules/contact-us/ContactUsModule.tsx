"use client";

import * as zod from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Mail, Users, Clock, HelpCircle, Send } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { sendContactMessageAction } from "@/actions/contact.action";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = zod.object({
  fullName: zod.string().min(1, "Full Name is required"),
  email: zod.email("Invalid email address").min(1,"Email is required!"),
  role: zod.enum(["STUDENT", "TUTOR"]),
  subject: zod.string().min(1, "Subject is required"),
  message: zod.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactUsModule() {
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      role: "" as any,
      subject: "",
      message: "",
    },
    validators: {
      onChange: contactSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await sendContactMessageAction(value);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Message sent successfully!");
          form.reset();
        }
      } catch (err) {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  return (
    <section className="bg-[#eef5ed] dark:bg-zinc-950 py-16 lg:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ── */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-emerald-200/50 dark:bg-emerald-900/30 px-4 py-1.5 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
              Connect With Us
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 dark:text-zinc-400 sm:text-lg">
            Have questions, feedback, or need assistance? We are here to help! Whether you are a student looking for the right tutor, an expert educator interested in joining our platform, feel free to reach out to the SkillBridge team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          
          {/* ── Left Column (Info) ── */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
              <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">Get in Touch</h2>
            </div>

            {/* Email Support */}
            <div className="flex items-start rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-emerald-100 dark:border-zinc-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white mr-4">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Email Support</h3>
                <a href="mailto:support@skillbridge.com" className="text-base font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  support@skillbridge.com
                </a>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">For general inquiries and user support</p>
              </div>
            </div>

            {/* Tutor Relations */}
            <div className="flex items-start rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-emerald-100 dark:border-zinc-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Tutor Relations</h3>
                <a href="mailto:tutors@skillbridge.com" className="text-base font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  tutors@skillbridge.com
                </a>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">For onboarding and tutor-specific queries</p>
              </div>
            </div>

            {/* Hours of Operation */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-emerald-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">Hours of Operation</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-200">Saturday – Tuesday</span>
                  <span className="text-sm text-gray-600 dark:text-zinc-400">9:00 AM – 6:00 PM (GMT+6)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-200">Friday</span>
                  <span className="inline-flex rounded bg-rose-100 dark:bg-rose-900/30 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                    CLOSED
                  </span>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-200 dark:bg-zinc-800 border border-emerald-100 dark:border-zinc-800 mt-2 flex items-center justify-center">
               <div className="absolute inset-0 z-0">
                  <iframe 
                    title="SkillBridge Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.700312678685!2d90.4042851!3d23.7946111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f70deb73%3A0x30c36498f90fe23!2sGulshan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-70 dark:opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  ></iframe>
               </div>
               
               <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-4 shadow-sm pointer-events-none">
                  <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">SkillBridge HQ</h3>
                  <p className="text-xs text-gray-600 dark:text-zinc-400">Gulshan, Dhaka, Bangladesh</p>
               </div>
            </div>
            
            
          </motion.div>

          {/* ── Right Column (Form) ── */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md p-8 sm:p-10 shadow-lg border border-white dark:border-zinc-800 h-fit"
          >
            <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">Drop Us a Message</h2>
            <p className="mb-8 text-sm text-gray-600 dark:text-zinc-400">We usually respond within 24 business hours.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <form.Field name="fullName" children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name} className="text-sm font-bold">Full Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="John Doe"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-emerald-50/50 dark:bg-zinc-800/50 border-emerald-100 dark:border-zinc-700 focus-visible:ring-emerald-500"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }} />

                {/* Email Address */}
                <form.Field name="email" children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name} className="text-sm font-bold">Email Address</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="john@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-emerald-50/50 dark:bg-zinc-800/50 border-emerald-100 dark:border-zinc-700 focus-visible:ring-emerald-500"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Role Field */}
                <form.Field name="role" children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name} className="text-sm font-bold">Role</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange as any}
                      >
                        <SelectTrigger id={field.name} aria-invalid={isInvalid} className="bg-emerald-50/50 dark:bg-zinc-800/50 border-emerald-100 dark:border-zinc-700 focus:ring-emerald-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="STUDENT">Student</SelectItem>
                            <SelectItem value="TUTOR">Tutor</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }} />

                {/* Subject */}
                <form.Field name="subject" children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name} className="text-sm font-bold">Subject</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="How can we help?"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-emerald-50/50 dark:bg-zinc-800/50 border-emerald-100 dark:border-zinc-700 focus-visible:ring-emerald-500"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }} />
              </div>

              {/* Message */}
              <form.Field name="message" children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name} className="text-sm font-bold">Message</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      placeholder="Tell us more about your inquiry..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-[160px] resize-none bg-emerald-50/50 dark:bg-zinc-800/50 border-emerald-100 dark:border-zinc-700 focus-visible:ring-emerald-500"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }} />

              {/* Submit Button */}
              <div className="pt-2">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className="w-full bg-green-800 hover:bg-green-900 text-white py-6 rounded-lg font-bold text-base flex items-center justify-center gap-2 dark:bg-green-700 dark:hover:bg-green-600 transition-colors"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <Send className="h-5 w-5" />}
                    </Button>
                  )}
                />
              </div>
              
              <p className="text-center text-xs text-gray-500 dark:text-zinc-500 mt-4">
                By clicking "Send Message", you agree to our Privacy Policy.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
