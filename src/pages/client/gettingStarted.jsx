import { Check, Circle, Lock } from "lucide-react";

export default function GettingStarted() {
  const steps = [
    {
      id: 1,
      title: "Upload This Week's Scorecard",
      description:
        "Our product works by allowing you to upload your scorecard PDF and other documents provided by Amazon each week into our system. We then combine all this data together to create easy to read scorecards for your drivers. The first step is getting a week of data into our system.",
      completed: true,
      locked: false,
      premium: false,
      button: null,
    },
    {
      id: 2,
      title: "Adjust Scorecard Options",
      description:
        "Scorecards show a driver's rank, pulled from the Amazon scorecard. You can choose to disable rankings entirely, or automatically exclude drivers who delivered less than a certain number of packages - helpful for when you don't want dispatchers or nursery routes to show up in your rankings.",
      completed: false,
      locked: false,
      premium: false,
      button: "Scorecard Options",
    },
    {
      id: 3,
      title: "View a Mobile Scorecard",
      description:
        "In addition to printing a PDF, your DAs can also view scorecards on their phones. You can generate links for these scorecards, or send them via SMS.",
      completed: true,
      locked: false,
      premium: true,
      button: null,
    },
    {
      id: 4,
      title: "Sync Roster",
      description:
        "Before you can send SMS scorecards to your DAs, you'll need to add their contact information into our system. You can do this easily by uploading your roster from Amazon, or copy/pasting your own list.",
      completed: true,
      locked: false,
      premium: false,
      button: null,
    },
    {
      id: 5,
      title: "Send Scorecards via SMS or E-Mail",
      description:
        "Now that you have contact information for your drivers, you can now send digital scorecard links to your DAs. You'll have a chance to select who you want to send SMS/E-Mail to, and to preview what the message will say before it gets sent.",
      completed: false,
      locked: true,
      premium: true,
      button: "Send SMS",
    },
    {
      id: 6,
      title: "Add Team Members",
      description:
        "If you have others on your management team that may need access to DRIVR, you can invite them! Invited team members will be able to upload scorecards, adjust settings, and send notifications to drivers. You do not need to add drivers, only others on your management team that need access to this administrative portal.",
      completed: false,
      locked: false,
      premium: false,
      button: "Invite Team Members",
    },
    {
      id: 7,
      title: "Add a Note",
      description:
        "Want to provide additional specific guidance, praise, or feedback to an individual DA? You can do that by adding a note to a scorecard. Notes appear prominently in their own section on scorecards and you can use them for any purpose you'd like.",
      completed: false,
      locked: true,
      premium: true,
      button: "Add Note",
    },
    {
      id: 8,
      title: "Activate Subscription",
      description:
        "If you like our service and would like to keep using premium features beyond the trial period, you can activate your subscription at any time. We won't bill you until after your trial is over, and you can cancel anytime online.",
      completed: false,
      locked: false,
      premium: false,
      button: "Activate Subscription",
    },
  ];

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanks for signing up with DRIVR!
          </h1>
          <p className="text-gray-700 mb-8">
            To introduce you to the features and capabilities of our product, we
            have a list of different areas, features, and settings you can try.
            If you don't which to use a feature, feel free to skip it or come
            back to it later.
          </p>

          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {step.locked ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                  ) : step.completed ? (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Circle className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    {step.premium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                        Premium Feature
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  {step.button && (
                    <button className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors font-medium text-sm">
                      {step.button}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
