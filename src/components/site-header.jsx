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

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()

  // Parse the current path to generate breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentRoute = pathSegments[0] || 'dashboard'
  const pageLabel = routeLabels[currentRoute] || 'Dashboard'
  const category = routeCategories[currentRoute]

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
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => navigate('/view-scorecards')}
        >
          <FileText className="w-4 h-4 mr-2" />
          View Scorecards
        </Button>
      </div>
    </header>
  );
}
