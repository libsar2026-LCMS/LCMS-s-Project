"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContact } from "@/actions/contact";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setServerError("");
    const result = await submitContact(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
      reset();
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
      {success ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Message Sent!</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Thank you for reaching out. We&apos;ll get back to you soon.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Full Name</label>
              <input
                {...register("full_name")}
                placeholder="Your full name"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {errors.full_name && <p className="mt-1 text-xs text-accent">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {errors.email && <p className="mt-1 text-xs text-accent">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Subject</label>
            <input
              {...register("subject")}
              placeholder="What is this about?"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.subject && <p className="mt-1 text-xs text-accent">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Message</label>
            <textarea
              {...register("message")}
              rows={5}
              placeholder="Write your message here..."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            />
            {errors.message && <p className="mt-1 text-xs text-accent">{errors.message.message}</p>}
          </div>

          {serverError && (
            <p className="rounded-xl bg-accent/8 px-4 py-3 text-sm text-accent">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={15} />
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
