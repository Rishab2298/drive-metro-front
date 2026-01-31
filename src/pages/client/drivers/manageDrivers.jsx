import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Users,
  UserCheck,
  UserX,
  Search,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  AlertCircle,
  Mail,
  Phone,
  User,
  Hash,
  RefreshCw,
  Briefcase,
  Award,
  CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PhoneInput, countries } from '@/components/ui/phone-input';
import SyncDriversModal from '@/components/SyncDriversModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

const ManageDrivers = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Sync modal state
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editForm, setEditForm] = useState({
    email: '',
    personalPhone: '',
    personalPhoneCountryCode: 'US',
    workPhone: '',
    workPhoneCountryCode: 'US',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Helper to parse phone number and extract country code
  const parsePhoneNumber = (phone) => {
    if (!phone) return { countryCode: 'US', phoneNumber: '' };

    // Try to match country dial code
    for (const country of countries) {
      if (phone.startsWith(country.dialCode)) {
        return {
          countryCode: country.code,
          phoneNumber: phone.slice(country.dialCode.length).replace(/\D/g, ''),
        };
      }
    }

    // Default to US if no match
    return { countryCode: 'US', phoneNumber: phone.replace(/\D/g, '') };
  };

  const fetchDrivers = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drivers');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [getToken]);

  // Filter drivers based on search and status
  const filteredDrivers = data?.drivers?.filter((driver) => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      driver.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && driver.isActive) ||
      (statusFilter === 'inactive' && !driver.isActive);

    return matchesSearch && matchesStatus;
  }) || [];

  // Calculate stats
  const totalDrivers = data?.drivers?.length || 0;
  const activeDrivers = data?.drivers?.filter((d) => d.isActive).length || 0;
  const inactiveDrivers = totalDrivers - activeDrivers;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Open edit modal
  const handleEditDriver = (driver) => {
    const personalParsed = parsePhoneNumber(driver.personalPhone);
    const workParsed = parsePhoneNumber(driver.workPhone);
    setEditingDriver(driver);
    setEditForm({
      email: driver.email || '',
      personalPhone: personalParsed.phoneNumber,
      personalPhoneCountryCode: personalParsed.countryCode,
      workPhone: workParsed.phoneNumber,
      workPhoneCountryCode: workParsed.countryCode,
      isActive: driver.isActive,
    });
    setSaveError(null);
    setEditModalOpen(true);
  };

  // Save driver changes
  const handleSaveDriver = async () => {
    if (!editingDriver) return;

    setSaving(true);
    setSaveError(null);

    try {
      // Combine country dial code with phone numbers
      const personalCountry = countries.find((c) => c.code === editForm.personalPhoneCountryCode);
      const personalDialCode = personalCountry?.dialCode || '+1';
      const fullPersonalPhone = editForm.personalPhone ? `${personalDialCode}${editForm.personalPhone}` : null;

      const workCountry = countries.find((c) => c.code === editForm.workPhoneCountryCode);
      const workDialCode = workCountry?.dialCode || '+1';
      const fullWorkPhone = editForm.workPhone ? `${workDialCode}${editForm.workPhone}` : null;

      const token = await getToken();
      const response = await fetch(`${API_URL}/api/drivers/${editingDriver.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: editForm.email || null,
          personalPhone: fullPersonalPhone,
          workPhone: fullWorkPhone,
          isActive: editForm.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update driver');
      }

      const updatedDriver = await response.json();

      // Update the driver in the local state
      setData((prevData) => ({
        ...prevData,
        drivers: prevData.drivers.map((d) =>
          d.id === editingDriver.id ? { ...d, ...updatedDriver.driver } : d
        ),
      }));

      setEditModalOpen(false);
      setEditingDriver(null);
    } catch (err) {
      console.error('Error updating driver:', err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle driver active status directly
  const handleToggleStatus = async (driver) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/drivers/${driver.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !driver.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update driver status');
      }

      const updatedDriver = await response.json();

      // Update the driver in the local state
      setData((prevData) => ({
        ...prevData,
        drivers: prevData.drivers.map((d) =>
          d.id === driver.id ? { ...d, ...updatedDriver.driver } : d
        ),
      }));
    } catch (err) {
      console.error('Error toggling driver status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-sm text-muted-foreground">Loading drivers...</p>
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
          <h2 className="text-lg font-semibold text-foreground">Unable to load drivers</h2>
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

  const { dsp } = data || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-2">
                {dsp?.companyName || dsp?.dspCode}
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manage Drivers</h1>
              <p className="text-muted-foreground max-w-md">
                View and manage all drivers in your fleet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-neutral-500" />
              <span className="text-xs text-muted-foreground">Total Drivers</span>
            </div>
            <p className="text-2xl font-bold">{totalDrivers}</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Active Drivers</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeDrivers}</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-1">
              <UserX className="w-4 h-4 text-neutral-400" />
              <span className="text-xs text-muted-foreground">Inactive Drivers</span>
            </div>
            <p className="text-2xl font-bold text-neutral-500">{inactiveDrivers}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <button
            onClick={() => setSyncModalOpen(true)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
              'hover:bg-neutral-800 dark:hover:bg-neutral-100'
            )}
          >
            <RefreshCw className="w-4 h-4" />
            Sync Drivers
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                  'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                )}
              >
                {statusFilter === 'all' && 'All Status'}
                {statusFilter === 'active' && 'Active Only'}
                {statusFilter === 'inactive' && 'Inactive Only'}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                Inactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Drivers List */}
        {filteredDrivers.length > 0 ? (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-3">Driver</div>
              <div className="col-span-2">Employee ID</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-2">Added</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center transition-colors',
                    'hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
                  )}
                >
                  {/* Driver Name */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                        driver.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                      )}
                    >
                      {driver.firstName?.[0]}
                      {driver.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {driver.firstName} {driver.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {driver.employeeId}
                      </p>
                    </div>
                  </div>

                  {/* Employee ID */}
                  <div className="col-span-2 hidden md:block">
                    <p className="text-sm font-mono text-foreground">{driver.employeeId}</p>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3 hidden md:block">
                    {driver.workPhone ? (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{driver.workPhone}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-red-500 dark:text-red-400">No work phone</span>
                    )}
                  </div>

                  {/* Added Date */}
                  <div className="col-span-2 hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(driver.createdAt)}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 hidden md:block">
                    <Badge
                      variant={driver.isActive ? 'default' : 'secondary'}
                      className={cn(
                        driver.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-100'
                      )}
                    >
                      {driver.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/view-scorecards`)}
                        >
                          View Scorecards
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDriver(driver)}>
                          Edit Driver
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(driver)}
                          className="text-red-600 dark:text-red-400"
                        >
                          {driver.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Users className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No drivers found' : 'No drivers yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Drivers will appear here once you upload your first scorecard.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/upload-scorecard')}
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors',
                  'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                  'hover:bg-neutral-800 dark:hover:bg-neutral-100'
                )}
              >
                Upload Scorecard
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        {filteredDrivers.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredDrivers.length} of {totalDrivers} drivers
          </p>
        )}
      </div>

      {/* Edit Driver Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>
              Update contact information and status for this driver.
            </DialogDescription>
          </DialogHeader>

          {editingDriver && (
            <div className="space-y-6 py-4">
              {/* Read-only Driver Info */}
              <div className="space-y-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Driver Name</p>
                    <p className="font-medium text-foreground">
                      {editingDriver.firstName} {editingDriver.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Transporter ID</p>
                    <p className="font-medium font-mono text-foreground">
                      {editingDriver.employeeId}
                    </p>
                  </div>
                </div>
                {editingDriver.position && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="font-medium text-foreground">{editingDriver.position}</p>
                    </div>
                  </div>
                )}
                {editingDriver.qualifications && (
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Qualifications</p>
                      <p className="font-medium text-foreground text-sm">{editingDriver.qualifications}</p>
                    </div>
                  </div>
                )}
                {editingDriver.idExpiration && (
                  <div className="flex items-center gap-3">
                    <CalendarClock className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">ID Expiration</p>
                      <p className="font-medium text-foreground">
                        {new Date(editingDriver.idExpiration).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="driver@example.com"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    Personal Phone
                  </Label>
                  <PhoneInput
                    value={editForm.personalPhone}
                    onChange={(value) =>
                      setEditForm((prev) => ({ ...prev, personalPhone: value }))
                    }
                    selectedCountry={editForm.personalPhoneCountryCode}
                    onCountryChange={(code) =>
                      setEditForm((prev) => ({ ...prev, personalPhoneCountryCode: code }))
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    Work Phone
                    <span className="text-xs text-muted-foreground">(used for SMS)</span>
                  </Label>
                  <PhoneInput
                    value={editForm.workPhone}
                    onChange={(value) =>
                      setEditForm((prev) => ({ ...prev, workPhone: value }))
                    }
                    selectedCountry={editForm.workPhoneCountryCode}
                    onCountryChange={(code) =>
                      setEditForm((prev) => ({ ...prev, workPhoneCountryCode: code }))
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive" className="text-base">
                      Active Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {editForm.isActive
                        ? 'Driver is currently active'
                        : 'Driver is currently inactive'}
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={editForm.isActive}
                    onCheckedChange={(checked) =>
                      setEditForm((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>
              </div>

              {/* Error Message */}
              {saveError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'border border-neutral-200 dark:border-neutral-700',
                'hover:bg-neutral-50 dark:hover:bg-neutral-800'
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDriver}
              disabled={saving}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Drivers Modal */}
      <SyncDriversModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        onSyncComplete={fetchDrivers}
      />
    </div>
  );
};

export default ManageDrivers;
