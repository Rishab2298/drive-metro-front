import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  User,
  Phone,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput, countries } from "@/components/ui/phone-input";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)", offset: "UTC-9" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)", offset: "UTC-10" },
  { value: "Europe/London", label: "London (GMT)", offset: "UTC+0" },
  { value: "Europe/Paris", label: "Central European (CET)", offset: "UTC+1" },
  { value: "Asia/Tokyo", label: "Japan (JST)", offset: "UTC+9" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "UTC+8" },
  { value: "Australia/Sydney", label: "Sydney (AEST)", offset: "UTC+10" },
];

const onboardingSchema = z.object({
  dspCode: z
    .string()
    .min(1, "DSP ID is required")
    .regex(/^[A-Z0-9]+$/, "Must be uppercase alphanumeric"),
  stationCode: z
    .string()
    .min(1, "Station code is required")
    .regex(/^[A-Z0-9]+$/, "Must be uppercase alphanumeric"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .max(100, "Owner name must be less than 100 characters"),
  ownerEmail: z
    .string()
    .min(1, "Owner email is required")
    .email("Please enter a valid email address"),
  contactEmail: z
    .string()
    .min(1, "Contact email is required")
    .email("Please enter a valid email address"),
  countryCode: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{7,15}$/, "Phone number must be 7-15 digits"),
  timezone: z.string().min(1, "Please select a timezone"),
});

const steps = [
  {
    id: 1,
    title: "Business Details",
    description: "DSP identification",
    icon: Briefcase,
    fields: ["dspCode", "stationCode", "companyName"],
  },
  {
    id: 2,
    title: "Owner Information",
    description: "Primary contact",
    icon: User,
    fields: ["ownerName", "ownerEmail"],
  },
  {
    id: 3,
    title: "Contact Details",
    description: "Communication preferences",
    icon: Phone,
    fields: ["contactEmail", "countryCode", "phoneNumber", "timezone"],
  },
];

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const form = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      dspCode: "",
      stationCode: "",
      companyName: "",
      ownerName: user?.fullName || "",
      ownerEmail: user?.primaryEmailAddress?.emailAddress || "",
      contactEmail: user?.primaryEmailAddress?.emailAddress || "",
      countryCode: "US",
      phoneNumber: "",
      timezone: "America/Los_Angeles",
    },
  });

  // Update form values when user loads
  useEffect(() => {
    if (isLoaded && user) {
      if (!form.getValues("ownerName") && user.fullName) {
        form.setValue("ownerName", user.fullName);
      }
      if (!form.getValues("ownerEmail") && user.primaryEmailAddress?.emailAddress) {
        form.setValue("ownerEmail", user.primaryEmailAddress.emailAddress);
      }
      if (!form.getValues("contactEmail") && user.primaryEmailAddress?.emailAddress) {
        form.setValue("contactEmail", user.primaryEmailAddress.emailAddress);
      }
    }
  }, [isLoaded, user, form]);

  const validateCurrentStep = async () => {
    const currentStepData = steps[currentStep - 1];
    const result = await form.trigger(currentStepData.fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      const selectedCountry = countries.find((c) => c.code === data.countryCode);
      const dialCode = selectedCountry?.dialCode || "+1";
      const fullPhoneNumber = `${dialCode}${data.phoneNumber}`;

      const response = await fetch(`${API_URL}/api/dsp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dspCode: data.dspCode,
          stationCode: data.stationCode,
          companyName: data.companyName,
          ownerName: data.ownerName,
          ownerEmail: data.ownerEmail,
          contactEmail: data.contactEmail,
          phoneNumber: fullPhoneNumber,
          timezone: data.timezone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.code === "DUPLICATE_DSP_STATION") {
          throw new Error("A DSP with this DSP ID and Station Code combination already exists. Please check your details.");
        }
        throw new Error(result.error || "Failed to create DSP");
      }

      // Reload user to get updated metadata from Clerk
      await user.reload();

      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding failed:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-border"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-indigo-600 animate-spin"></div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex w-95 bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex-col relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col h-full p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">DiveMetric</span>
          </div>

          {/* Steps */}
          <div className="flex-1 space-y-2">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`
                    group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                    ${isActive ? "bg-white/10 backdrop-blur-sm" : "hover:bg-white/5"}
                  `}
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        absolute left-7.5 top-15 w-0.5 h-8 transition-colors duration-500
                        ${isCompleted ? "bg-indigo-400" : "bg-slate-700"}
                      `}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`
                      relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300
                      ${isCompleted
                        ? "bg-linear-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/25"
                        : isActive
                        ? "bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25"
                        : "bg-slate-800 border border-slate-700"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                        font-medium text-sm transition-colors duration-300
                        ${isActive ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-500"}
                      `}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                  </div>

                  {/* Step number */}
                  <span
                    className={`
                      text-xs font-mono transition-colors duration-300
                      ${isActive ? "text-indigo-400" : "text-slate-600"}
                    `}
                  >
                    0{step.id}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Trial info and Security badge */}
          <div className="mt-auto pt-8 border-t border-slate-800 space-y-4">
            {/* Free trial badge */}
            <div className="p-4 rounded-xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <p className="text-sm font-semibold text-white mb-1">30-Day Free Trial</p>
              <p className="text-xs text-slate-400">Full access to all premium features. No credit card required.</p>
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Your data is encrypted and secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card border-b border-border px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">DiveMetric</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-foreground" />
                ) : (
                  <Moon className="w-4 h-4 text-foreground" />
                )}
              </button>
              <span className="text-xs font-mono text-muted-foreground">Step {currentStep} of {steps.length}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-xl">
            {/* Step Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-xs font-semibold">
                    {currentStep}
                  </span>
                  <span>Step {currentStep} of {steps.length}</span>
                </div>
                {/* Desktop Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-accent border border-border transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-foreground" />
                      <span className="text-sm text-foreground">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-foreground" />
                      <span className="text-sm text-foreground">Dark</span>
                    </>
                  )}
                </button>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {currentStepData.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                {currentStep === 1 && "Enter your Amazon DSP credentials and company information"}
                {currentStep === 2 && "Tell us about the primary account owner"}
                {currentStep === 3 && "How should we reach you?"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Business Details */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dspCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">
                              DSP ID
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="DSP12345"
                                className="h-11 bg-card border-border text-foreground focus:border-indigo-400 focus:ring-indigo-400/20 transition-all placeholder:text-muted-foreground"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value.toUpperCase())
                                }
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stationCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">
                              Station Code
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="DLA4"
                                className="h-11 bg-card border-border text-foreground focus:border-indigo-400 focus:ring-indigo-400/20 transition-all placeholder:text-muted-foreground"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value.toUpperCase())
                                }
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your delivery service partner company"
                              className="h-11 bg-card border-border text-foreground focus:border-indigo-400 focus:ring-indigo-400/20 transition-all placeholder:text-muted-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Owner Information */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Smith"
                              className="h-11 bg-card border-border text-foreground focus:border-indigo-400 focus:ring-indigo-400/20 transition-all placeholder:text-muted-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@company.com"
                              className="h-11 bg-card border-border text-foreground focus:border-indigo-400 focus:ring-indigo-400/20 transition-all placeholder:text-muted-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Contact Details */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Contact Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="contact@company.com"
                              className="h-11 bg-card border-border text-foreground focus:border-indigo-400 focus:ring-indigo-400/20 transition-all placeholder:text-muted-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Phone Number
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field: countryField }) => (
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field: phoneField }) => (
                              <PhoneInput
                                value={phoneField.value}
                                onChange={phoneField.onChange}
                                selectedCountry={countryField.value}
                                onCountryChange={countryField.onChange}
                                placeholder="(555) 123-4567"
                                error={
                                  form.formState.errors.phoneNumber ||
                                  form.formState.errors.countryCode
                                }
                              />
                            )}
                          />
                        )}
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {form.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Timezone
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-card border-border text-foreground focus:border-indigo-400 focus:ring-indigo-400/20 transition-all">
                                <SelectValue placeholder="Select your timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-70">
                              {timezones.map((tz) => (
                                <SelectItem
                                  key={tz.value}
                                  value={tz.value}
                                  className="py-2.5"
                                >
                                  <div className="flex items-center justify-between w-full gap-4">
                                    <span>{tz.label}</span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {tz.offset}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="h-11 px-6 border-border hover:bg-muted transition-all"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="h-11 px-8 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 transition-all ml-auto"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-8 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 transition-all ml-auto disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>

            {/* Help Link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              Need assistance?{" "}
              <a
                href="mailto:support@divemetric.com"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
