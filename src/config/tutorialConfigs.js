// Tutorial step definitions per page
// Each step: { id, title, description, side }
// 'side' is the Radix Popover side: 'top' | 'bottom' | 'left' | 'right'

export const TUTORIAL_STEPS = {
  upload: [
    {
      id: 'welcome',
      title: 'Welcome to DiveMetric!',
      description:
        'Each week, upload your reports here to automatically generate driver scorecards and analytics. Let\'s walk you through the process.',
      side: 'bottom',
    },
    {
      id: 'required-docs',
      title: 'Required Documents',
      description:
        'Upload these 2 files every week: the DSP Scorecard PDF and the Weekly Overview CSV. Both are required to generate scorecards. Click a row to expand and see the expected filename format.',
      side: 'bottom',
    },
    {
      id: 'required-dsp-link',
      title: 'Open in DSP Dashboard',
      description:
        'Tap this violet button to jump directly to the right page in your DSP portal where you can download this file.',
      side: 'left',
    },
    {
      id: 'required-export-guide',
      title: 'Step-by-Step Export Guide',
      description:
        'Click here for a detailed step-by-step guide showing exactly how to export this file from your portal.',
      side: 'left',
    },
    {
      id: 'optional-docs',
      title: 'Optional Documents',
      description:
        'These reports add extra insights like Customer Feedback and POD Quality. Not required, but recommended for a complete picture of driver performance.',
      side: 'top',
    },
    {
      id: 'premium-docs',
      title: 'Premium Reports',
      description:
        'Pro subscribers can upload advanced reports: Safety Dashboard, DVIC inspection data, PPS compliance, and more. Upgrade your plan to unlock these.',
      side: 'top',
    },
    {
      id: 'process-btn',
      title: 'Process Documents',
      description:
        'Once the required documents are uploaded, this button activates. Click it to generate all driver scorecards for the week. You\'ll be taken to the results page automatically.',
      side: 'top',
    },
    {
      id: 'sync-reminder',
      title: 'Add Driver Contacts After Processing',
      description:
        'After processing, go to Manage Drivers → click "Sync Drivers" → upload associatesdata.csv from the Associates Portal. This adds driver email & phone numbers so you can send scorecards via SMS or Email.',
      side: 'top',
    },
  ],

  'manage-drivers': [
    {
      id: 'welcome',
      title: 'Manage Drivers',
      description:
        'This is your driver roster. Keep contact info up to date so scorecard notifications reach the right people via SMS or Email.',
      side: 'bottom',
    },
    {
      id: 'sync-btn',
      title: 'Sync Drivers from Portal',
      description:
        'Click "Sync Drivers" to import your driver list. Upload associatesdata.csv from the Associates Portal — this fills in driver names, employee IDs, email addresses, and phone numbers automatically.',
      side: 'bottom',
    },
    {
      id: 'driver-table',
      title: 'Your Driver Roster',
      description:
        'All drivers appear here with their contact info and status. Drivers showing "No phone" in red need their phone number added before you can send SMS notifications.',
      side: 'top',
    },
    {
      id: 'edit-driver',
      title: 'Edit Driver Contact Info',
      description:
        'Click ⋮ → Edit Driver to manually add or update a driver\'s email and personal phone number. The phone number is used for SMS scorecard delivery.',
      side: 'left',
    },
    {
      id: 'ranking-toggle',
      title: 'Ranking Toggle',
      description:
        'Toggle this to include or exclude a driver from the weekly performance ranking — useful for drivers on leave, recently hired, or otherwise exempt from ranking that week.',
      side: 'left',
    },
  ],

  'master-scorecard': [
    {
      id: 'welcome',
      title: 'Your Master Scorecard',
      description:
        'Every driver from your uploaded reports is listed here, ranked and scored for the week. This is your command center for managing driver performance.',
      side: 'bottom',
    },
    {
      id: 'summary-cards',
      title: 'Week Summary',
      description:
        'Quick overview of the week: total drivers, how many are ranked, total packages delivered, and your station\'s overall standing tier.',
      side: 'bottom',
    },
    {
      id: 'search-bar',
      title: 'Search Drivers',
      description:
        'Type a driver\'s name here to instantly filter the list and find a specific driver.',
      side: 'bottom',
    },
    {
      id: 'driver-table',
      title: 'Driver Rankings Table',
      description:
        'Drivers are ranked 1–N by score. Each row shows rank, performance tier (Platinum, Gold, Silver, etc.), and packages delivered that week. Click any column header to sort.',
      side: 'bottom',
    },
    {
      id: 'driver-icons',
      title: 'Driver Status Icons',
      description: 'Small badges next to a driver\'s name show their current status at a glance.',
      badges: [
        {
          iconName: 'BadgeCheck',
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          label: 'Acknowledged',
          detail: 'Driver ticked the confirmation checkbox after viewing their scorecard',
        },
        {
          iconName: 'StickyNote',
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          iconColor: 'text-amber-600 dark:text-amber-400',
          label: 'Manager Note',
          detail: "You've added a private note for this driver",
        },
        {
          iconName: 'Sparkles',
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          label: 'AI Feedback',
          detail: 'AI coaching feedback has been generated',
        },
      ],
      side: 'right',
    },
    {
      id: 'actions-btn',
      title: 'Per-Driver Actions',
      description:
        'Click "Actions" on any driver to: add a private manager note, remove the driver from this week\'s ranking, or override their performance tier.',
      side: 'top',
    },
    {
      id: 'share-btn',
      title: 'Share Scorecard',
      description:
        'Click "Share" to send this driver\'s personal scorecard via SMS, Email, or PDF download. "Copy Link" gives a shareable URL the driver can view on their phone.',
      side: 'top',
    },
    {
      id: 'preview-btn',
      title: 'Preview Scorecard',
      description:
        'Click "Preview" to see the full driver scorecard — exactly what they\'ll see — before you send it.',
      side: 'top',
    },
    {
      id: 'bulk-actions',
      title: 'Bulk Actions & AI Coaching',
      description:
        'Check the box next to any drivers to select them. A bulk actions bar appears — send SMS, send Emails, download PDFs, or click "Generate AI Feedback" to create personalized coaching messages for each selected driver based on their metrics. Just a point to be noteds, you will not be able to send more then one message or do the AI coaching extraction for the driver that week. ',
      side: 'right',
    },
  ],
};
