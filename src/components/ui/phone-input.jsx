"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// Comprehensive country list with proper unique identifiers
const countries = [
  // North America
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  // Europe
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿" },
  { code: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴" },
  { code: "HU", name: "Hungary", dialCode: "+36", flag: "🇭🇺" },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
  { code: "HR", name: "Croatia", dialCode: "+385", flag: "🇭🇷" },
  { code: "BG", name: "Bulgaria", dialCode: "+359", flag: "🇧🇬" },
  { code: "SK", name: "Slovakia", dialCode: "+421", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", dialCode: "+386", flag: "🇸🇮" },
  { code: "LT", name: "Lithuania", dialCode: "+370", flag: "🇱🇹" },
  { code: "LV", name: "Latvia", dialCode: "+371", flag: "🇱🇻" },
  { code: "EE", name: "Estonia", dialCode: "+372", flag: "🇪🇪" },
  { code: "LU", name: "Luxembourg", dialCode: "+352", flag: "🇱🇺" },
  // Asia Pacific
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
  // South America
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
  // Middle East
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱" },
  // Africa
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
];

const popularCountries = ["US", "CA", "GB", "DE", "FR", "AU", "IN"];

function formatPhoneNumber(value, countryCode) {
  const numbers = value.replace(/\D/g, "");

  // US/Canada formatting
  if (countryCode === "US" || countryCode === "CA") {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }

  // UK formatting
  if (countryCode === "GB") {
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 11)}`;
  }

  // Default international formatting
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
}

const PhoneInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onCountryChange,
      defaultCountry = "US",
      selectedCountry,
      placeholder = "Phone number",
      disabled = false,
      className,
      error,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalCountry, setInternalCountry] = React.useState(defaultCountry);

    const currentCountryCode = selectedCountry || internalCountry;
    const country = countries.find((c) => c.code === currentCountryCode) || countries[0];

    const handleCountrySelect = (countryCode) => {
      setInternalCountry(countryCode);
      onCountryChange?.(countryCode);
      setOpen(false);
    };

    const handlePhoneChange = (e) => {
      const rawValue = e.target.value.replace(/\D/g, "");
      onChange?.(rawValue);
    };

    const displayValue = value ? formatPhoneNumber(value, currentCountryCode) : "";

    const popular = countries.filter((c) => popularCountries.includes(c.code));
    const others = countries.filter((c) => !popularCountries.includes(c.code));

    return (
      <div className={cn("flex", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                "h-11 w-[120px] justify-between rounded-r-none border-r-0 bg-muted/50 px-3 font-normal hover:bg-muted",
                "focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400",
                "transition-all duration-200",
                error && "border-red-300 focus:ring-red-500/20 focus:border-red-400"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <span className="text-xl leading-none">{country.flag}</span>
                <span className="text-sm text-foreground font-medium">{country.dialCode}</span>
              </span>
              <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-40" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] p-0 shadow-xl border-border rounded-xl overflow-hidden"
            align="start"
          >
            <Command className="rounded-xl">
              <div className="flex items-center border-b border-border px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <CommandInput
                  placeholder="Search countries..."
                  className="h-11 border-0 focus:ring-0 placeholder:text-muted-foreground"
                />
              </div>
              <CommandList className="max-h-[280px]">
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  No country found
                </CommandEmpty>
                <CommandGroup heading="Popular" className="px-2 py-2">
                  {popular.map((c) => (
                    <CommandItem
                      key={c.code}
                      value={`${c.name} ${c.dialCode}`}
                      onSelect={() => handleCountrySelect(c.code)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                        "transition-colors duration-150",
                        currentCountryCode === c.code && "bg-purple-50 dark:bg-purple-900/30"
                      )}
                    >
                      <span className="text-xl leading-none">{c.flag}</span>
                      <span className="flex-1 text-sm font-medium text-foreground">{c.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{c.dialCode}</span>
                      {currentCountryCode === c.code && (
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="All Countries" className="px-2 py-2 border-t border-border">
                  {others.map((c) => (
                    <CommandItem
                      key={c.code}
                      value={`${c.name} ${c.dialCode}`}
                      onSelect={() => handleCountrySelect(c.code)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                        "transition-colors duration-150",
                        currentCountryCode === c.code && "bg-purple-50 dark:bg-purple-900/30"
                      )}
                    >
                      <span className="text-xl leading-none">{c.flag}</span>
                      <span className="flex-1 text-sm font-medium text-foreground">{c.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{c.dialCode}</span>
                      {currentCountryCode === c.code && (
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          ref={ref}
          type="tel"
          value={displayValue}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-11 flex-1 rounded-l-none border-l-0",
            "focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:border-purple-400",
            "transition-all duration-200 text-base tracking-wide",
            error && "border-red-300 focus-visible:ring-red-500/20 focus-visible:border-red-400"
          )}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput, countries };
