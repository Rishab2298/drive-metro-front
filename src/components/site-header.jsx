import { SidebarIcon, FileText } from "lucide-react"
import { useLocation, Link, useNavigate } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { useTutorial } from "@/contexts/TutorialContext"

// Route to breadcrumb label mapping
const routeLabels = {
  'dashboard': 'Dashboard',
  'manage-drivers': 'Manage Drivers',
  'upload-scorecard': 'Upload Scorecard',
  'view-scorecards': 'View Scorecards',
  'processing-results': 'Processing Results',
  'master-scorecard': 'Master Scorecard',
  'driver-scorecard': 'Driver Scorecard',
  'getting-started': 'Getting Started',
  'onboarding': 'Onboarding',
  'settings': 'General Settings',
};

// Route to category mapping
const routeCategories = {
  'dashboard': null,
  'manage-drivers': 'Drivers',
  'upload-scorecard': 'Scorecards',
  'view-scorecards': 'Scorecards',
  'processing-results': 'Scorecards',
  'master-scorecard': 'Scorecards',
  'driver-scorecard': 'Scorecards',
  'getting-started': null,
  'onboarding': null,
  'settings': 'Settings',
};

// Routes that have a tutorial — maps to tutorial page ID
const routeToTutorialPage = {
  'upload-scorecard': 'upload',
  'manage-drivers': 'manage-drivers',
  'master-scorecard': 'master-scorecard',
};

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const { isTutorialActiveForPage, startTutorial, skipTutorial } = useTutorial()

  // Parse the current path to generate breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentRoute = pathSegments[0] || 'dashboard'
  const pageLabel = routeLabels[currentRoute] || 'Dashboard'
  const category = routeCategories[currentRoute]

  // Tutorial toggle state for current page
  const tutorialPage = routeToTutorialPage[currentRoute]
  const tutorialAvailable = !!tutorialPage
  const tutorialOn = tutorialPage ? isTutorialActiveForPage(tutorialPage) : false

  const handleTutorialToggle = (checked) => {
    if (checked) {
      startTutorial(tutorialPage)
    } else {
      skipTutorial()
    }
  }

  return (
    <header
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">DiveMetric</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-muted-foreground">
                    {category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Right side controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Tutorial Toggle — only shown on tutorial-enabled pages */}
          {tutorialAvailable && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <span className={`text-xs font-medium transition-colors ${
                tutorialOn
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}>
                {tutorialOn ? 'Tutorial ON' : 'Watch Tutorial'}
              </span>
              <Switch
                checked={tutorialOn}
                onCheckedChange={handleTutorialToggle}
                className="data-[state=checked]:bg-blue-600 h-4 w-7 [&>span]:h-3 [&>span]:w-3"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/view-scorecards')}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Scorecards
          </Button>
        </div>
      </div>
    </header>
  );
}
