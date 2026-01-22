import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  Loader2,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PhoneInput, countries } from '@/components/ui/phone-input';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', offset: 'UTC-9' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)', offset: 'UTC-10' },
  { value: 'Europe/London', label: 'London (GMT)', offset: 'UTC+0' },
  { value: 'Europe/Paris', label: 'Central European (CET)', offset: 'UTC+1' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)', offset: 'UTC+9' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 'UTC+8' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)', offset: 'UTC+10' },
];

// Helper to parse phone number and extract country code
const parsePhoneNumber = (phone) => {
  if (!phone) return { countryCode: 'US', phoneNumber: '' };

  for (const country of countries) {
    if (phone.startsWith(country.dialCode)) {
      return {
        countryCode: country.code,
        phoneNumber: phone.slice(country.dialCode.length).replace(/\D/g, ''),
      };
    }
  }

  return { countryCode: 'US', phoneNumber: phone.replace(/\D/g, '') };
};

const GeneralSettings = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dspData, setDspData] = useState(null);

  // Form state
  const [form, setForm] = useState({
    companyName: '',
    ownerName: '',
    ownerEmail: '',
    contactEmail: '',
    phoneNumber: '',
    countryCode: 'US',
    timezone: 'America/Los_Angeles',
  });

  // Track if form has been modified
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchDspData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/dsp/full`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch DSP information');
        }

        const data = await response.json();
        setDspData(data);

        // Parse phone number
        const { countryCode, phoneNumber } = parsePhoneNumber(data.phoneNumber);

        // Initialize form with fetched data
        setForm({
          companyName: data.companyName || '',
          ownerName: data.ownerName || '',
          ownerEmail: data.ownerEmail || '',
          contactEmail: data.contactEmail || '',
          phoneNumber: phoneNumber,
          countryCode: countryCode,
          timezone: data.timezone || 'America/Los_Angeles',
        });
      } catch (err) {
        console.error('Error fetching DSP data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDspData();
  }, [getToken]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Combine country dial code with phone number
      const selectedCountry = countries.find((c) => c.code === form.countryCode);
      const dialCode = selectedCountry?.dialCode || '+1';
      const fullPhoneNumber = form.phoneNumber ? `${dialCode}${form.phoneNumber}` : '';

      const token = await getToken();
      const response = await fetch(`${API_URL}/api/dsp`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: form.companyName,
          ownerName: form.ownerName,
          ownerEmail: form.ownerEmail,
          contactEmail: form.contactEmail,
          phoneNumber: fullPhoneNumber,
          timezone: form.timezone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update DSP information');
      }

      const updatedData = await response.json();
      setDspData((prev) => ({ ...prev, ...updatedData.dsp }));
      setHasChanges(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating DSP:', err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Unable to load settings</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-2">
                Settings
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">General Settings</h1>
              <p className="text-muted-foreground max-w-md">
                Manage your DSP information and company details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* DSP Identification - Read Only */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-neutral-500" />
            DSP Identification
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            These identifiers are fixed and cannot be changed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    DSP ID
                  </p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {dspData?.dspCode || '—'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Station Code
                  </p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {dspData?.stationCode || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Settings */}
        <div className="space-y-8">
          {/* Company Information */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-neutral-500" />
              Company Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-500" />
              Owner Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={form.ownerName}
                  onChange={(e) => handleFormChange('ownerName', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={form.ownerEmail}
                  onChange={(e) => handleFormChange('ownerEmail', e.target.value)}
                  placeholder="owner@company.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-500" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  Phone Number
                </Label>
                <PhoneInput
                  value={form.phoneNumber}
                  onChange={(value) => handleFormChange('phoneNumber', value)}
                  selectedCountry={form.countryCode}
                  onCountryChange={(code) => handleFormChange('countryCode', code)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Timezone Settings */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-500" />
              Timezone
            </h3>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={form.timezone}
                onValueChange={(value) => handleFormChange('timezone', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-70">
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value} className="py-2.5">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{tz.label}</span>
                        <span className="text-xs text-slate-400 font-mono">{tz.offset}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Message */}
          {saveError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-600 dark:text-green-400">
                Settings saved successfully!
              </p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={cn(
                'px-6',
                hasChanges
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
