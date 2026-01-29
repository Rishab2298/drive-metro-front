import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubscription } from "@/contexts/SubscriptionContext";
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
  FileText,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
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
    fields: ["contactEmail", "countryCode", "phoneNumber", "timezone", "agreeToTerms"],
  },
];

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { refreshSubscription } = useSubscription();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);

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
      agreeToTerms: false,
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

      // Refresh subscription to get the new trial status
      await refreshSubscription();

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

                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-muted/30">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal text-foreground cursor-pointer">
                              I have read and agree to the{" "}
                              <button
                                type="button"
                                onClick={() => setShowTermsDialog(true)}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                              >
                                Terms of Service
                              </button>{" "}
                              and{" "}
                              <button
                                type="button"
                                onClick={() => setShowPrivacyDialog(true)}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                              >
                                Privacy Policy
                              </button>
                            </FormLabel>
                            <FormMessage className="text-xs" />
                          </div>
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

      {/* Terms of Service Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Terms of Service
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-sm text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground mb-2">1. Introduction</h3>
              <p className="mb-2">
                DiveMetric is a platform provided by <strong className="text-foreground">Kilimanjaro Innovation Labs Inc.</strong> ("we", "us", "our"), a company established under the laws of Delaware, USA.
              </p>
              <p>
                These Platform Terms apply to all users of DiveMetric, our software applications, websites, mobile apps, and such other technologies which we may make available. By accessing and using DiveMetric, you accept and agree to the terms of this Agreement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">2. Registration</h3>
              <p className="mb-2">
                In order to use certain parts of our Platform you may be required to register for an account by providing your name, phone number, location, email address and password.
              </p>
              <p>
                You must ensure that the details provided by you on registration are correct and complete. You may cancel your registration at any time by contacting hello@divemetric.com.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">3. Passwords and Security</h3>
              <p>
                You should keep your password confidential and not disclose or share with anyone. We will be entitled to treat any action carried out through your account as being carried out by you. You must notify us immediately if you believe your account may have been compromised.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">4. Using the Platform</h3>
              <p>
                Our Platform is intended for use only by those who can access it from within the United States of America. All users must be at least 18 years old to use the DiveMetric platform.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">5. Prohibited Uses</h3>
              <p className="mb-2">You must not:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use any automated system to extract content for commercial purposes</li>
                <li>Interfere with or damage the Platform</li>
                <li>Use the Platform for any illegal or unauthorized purpose</li>
                <li>Change, modify, or alter the Platform without authorization</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">6. Intellectual Property</h3>
              <p>
                Our Platform and all content displayed are protected by intellectual property rights. You may only view, print out, and use the Platform for your own personal, non-commercial use.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">7. Liability</h3>
              <p>
                We provide the Platform on an "as is" and "as available" basis. To the maximum extent permitted by law, our maximum liability to you is $50.
              </p>
            </section>

            <section className="pb-4">
              <h3 className="font-semibold text-foreground mb-2">8. Contact</h3>
              <p>
                For enquiries or complaints, please contact us at{" "}
                <a href="mailto:hello@divemetric.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  hello@divemetric.com
                </a>
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-sm text-muted-foreground">
            <section>
              <p>
                <strong className="text-foreground">Kilimanjaro Innovation Labs Inc.</strong> ("Company," "we," "us," or "our") operates DiveMetric and has prepared this Privacy Policy to explain what personal information we collect, how we use and share that information.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">1. Personal Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Identification Information:</strong> Name, email address, and phone number</li>
                <li><strong className="text-foreground">Financial Information:</strong> Payment information (tokenized, not stored on our servers)</li>
                <li><strong className="text-foreground">Communication Information:</strong> Information when you contact us</li>
                <li><strong className="text-foreground">Internet Activity:</strong> Browser type, pages visited, navigation patterns</li>
                <li><strong className="text-foreground">Device Information:</strong> Device name, operating system, and browser</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">2. Cookies</h3>
              <p>
                We use cookies to operate and administer our Site, gather usage data, and improve your experience. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">3. How We Use Personal Information</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide you with the Service and respond to inquiries</li>
                <li>To send administrative information</li>
                <li>To analyze how you interact with our Service</li>
                <li>To maintain and improve the Service</li>
                <li>To prevent fraud and comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">4. Sharing and Disclosure</h3>
              <p className="mb-2">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Vendors and service providers</li>
                <li>In connection with business transfers</li>
                <li>When required by law</li>
                <li>With our affiliates</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">5. Data Retention</h3>
              <p>
                We keep personal information for as long as reasonably necessary for the purposes described in this Privacy Policy, or as required by law.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">6. Security</h3>
              <p>
                We implement commercially reasonable technical, administrative, and organizational measures to protect personal information. However, no Internet transmission is ever fully secure.
              </p>
            </section>

            <section className="pb-4">
              <h3 className="font-semibold text-foreground mb-2">7. Contact Us</h3>
              <p>
                If you have any questions about our Privacy Policy, please contact us at{" "}
                <a href="mailto:hello@divemetric.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  hello@divemetric.com
                </a>
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
