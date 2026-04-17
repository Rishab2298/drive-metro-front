import * as React from "react"
import { useUser } from "@clerk/clerk-react"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Scorecards",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Upload Scorecard",
          url: "/upload-scorecard",
        },
        {
          title: "View Scorecards",
          url: "/view-scorecards",
        },
        // {
        //   title: "Scorecard Options",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Drivers",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Manage Drivers",
          url: "/manage-drivers",
        },
        // {
        //   title: "Sync Roster",
        //   url: "#",
        // },
        // {
        //   title: "Driver Performance",
        //   url: "#",
        // },
      ],
    },
    // {
    //   title: "Communications",
    //   url: "#",
    //   icon: MessageSquare,
    //   items: [
    //     {
    //       title: "Send SMS",
    //       url: "#",
    //     },
    //     {
    //       title: "Send Email",
    //       url: "#",
    //     },
    //     {
    //       title: "Add Notes",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Team",
    //   url: "#",
    //   icon: UserPlus,
    //   items: [
    //     {
    //       title: "Team Members",
    //       url: "#",
    //     },
    //     {
    //       title: "Invite Members",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        // {
        //   title: "Notifications",
        //   url: "#",
        // },
        // {
        //   title: "Preferences",
        //   url: "#",
        // },
      ],
    },
  ],
  navSecondary: [],
  quickLinks: [
    
    {
      name: "Billing",
      url: "/billing",
      icon: CreditCard,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { user } = useUser()

  // Build user data from Clerk
  const userData = {
    name: user?.fullName || user?.firstName || 'User',
    email: user?.primaryEmailAddress?.emailAddress || '',
    avatar: user?.imageUrl || '/avatars/default.jpg',
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div
                  className="bg-indigo-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-lg">
                  D
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">DiveMetric</span>
                  <span className="truncate text-xs">DSP Performance Analytics</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.quickLinks} />
      </SidebarContent>
      <SidebarFooter>
        <div className="mx-2 mb-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-3 py-2.5">
          <p className="text-[11px] text-blue-600/80 dark:text-blue-300/70 leading-relaxed">
            For support or queries, contact{' '}
            <a
              href="mailto:support@divemetric.com"
              className="font-semibold text-blue-700 dark:text-blue-300 hover:underline"
            >
              support@divemetric.com
            </a>
          </p>
        </div>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
