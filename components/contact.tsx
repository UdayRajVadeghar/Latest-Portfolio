"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import emailjs from "@emailjs/browser";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim(),
  templateId: "template_3ganjjc",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim(),
} as const;

const isEmailJsConfigured = Boolean(
  EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.publicKey
);

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    const publicKey = EMAILJS_CONFIG.publicKey;

    if (!publicKey) {
      console.warn(
        "EmailJS public key is not configured. Contact form submissions will fail until NEXT_PUBLIC_EMAILJS_PUBLIC_KEY is set."
      );
      return;
    }

    emailjs.init({ publicKey });
  }, []);

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      value: "udayraj.vadeghar@gmail.com",
      link: "mailto:udayraj.vadeghar@gmail.com",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Location",
      value: "Hyderabad, India",
      link: "https://maps.google.com/?q=Hyderabad,India",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      value: "Available on request",
      link: null,
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    if (!isEmailJsConfigured) {
      console.error(
        "EmailJS environment variables are missing. Ensure NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY are set."
      );
      setSubmitStatus({
        type: "error",
        message:
          "Contact form is temporarily unavailable. Please email me directly while I fix the configuration.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const formData = new FormData(formRef.current);
      const name = formData.get("from_name") as string;
      const email = formData.get("from_email") as string;
      const subject = formData.get("subject") as string;
      const originalMessage = formData.get("message") as string;

      const formattedMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${originalMessage}`;

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId!,
        EMAILJS_CONFIG.templateId!,
        {
          from_name: name,
          from_email: email,
          subject: subject,
          message: formattedMessage,
        },
        {
          publicKey: EMAILJS_CONFIG.publicKey!,
        }
      );

      if (result.text === "OK") {
        setSubmitStatus({
          type: "success",
          message:
            "Thank you! Your message has been sent successfully. I'll get back to you soon.",
        });
        formRef.current.reset();
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Oops! Something went wrong. Please try again or email me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-muted/30">
      <section id="contact" className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Get In Touch
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have a project in mind or want to discuss opportunities? I'd
                love to hear from you!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {submitStatus.type && (
                        <div
                          className={`p-3 sm:p-4 rounded-lg border flex items-start gap-3 ${
                            submitStatus.type === "success"
                              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                              : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                          }`}
                        >
                          {submitStatus.type === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                          )}
                          <p
                            className={`text-sm ${
                              submitStatus.type === "success"
                                ? "text-green-800 dark:text-green-200"
                                : "text-red-800 dark:text-red-200"
                            }`}
                          >
                            {submitStatus.message}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="from_name"
                            className="text-sm font-medium"
                          >
                            Name
                          </label>
                          <Input
                            id="from_name"
                            name="from_name"
                            placeholder="Your name"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="from_email"
                            className="text-sm font-medium"
                          >
                            Email
                          </label>
                          <Input
                            id="from_email"
                            name="from_email"
                            type="email"
                            placeholder="Your email"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="text-sm font-medium"
                        >
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Subject of your message"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium"
                        >
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Your message"
                          className="min-h-[150px]"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span className="hidden sm:inline">
                              Sending Message...
                            </span>
                            <span className="sm:hidden">Sending...</span>
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full mt-1">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            target={
                              info.title === "Location" ? "_blank" : undefined
                            }
                            rel={
                              info.title === "Location"
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2">Connect with me</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Find me on these platforms
                    </p>
                    <div className="flex gap-4">
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href="https://github.com/udayrajvadeghar"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                            <path d="M9 18c-4.51 2-5-2-7-2"></path>
                          </svg>
                          <span className="sr-only">GitHub</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href="https://www.linkedin.com/in/uday-raj-vadeghar/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect width="4" height="12" x="2" y="9"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                          <span className="sr-only">LinkedIn</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="mailto:udayraj.vadeghar@gmail.com">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <rect
                              width="20"
                              height="16"
                              x="2"
                              y="4"
                              rx="2"
                            ></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </svg>
                          <span className="sr-only">Email</span>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
