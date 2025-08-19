"use client"

import React,{ useState, Suspense } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { Home, User, Trophy, BarChart3, Calendar, Target, Brain, Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Loading from "@/components/ui/loading"
import { Logo, LogoIcon } from "@/components/ui/logo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      document.cookie = "USSQ-API-SESSION=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/")
    }
  }

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <User className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Statistics",
      href: "/dashboard/statistics",
      icon: <BarChart3 className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Matches",
      href: "/dashboard/matches",
      icon: <Target className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tournaments",
      href: "/dashboard/tournaments",
      icon: <Trophy className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "AI Tournament Recommendations",
      href: "/dashboard/ai-tournament-recommendations",
      icon: <Calendar className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Player Tracker",
      href: "/dashboard/player-tracker",
      icon: <Search className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "AI Analysis",
      href: "/dashboard/ai-analysis",
      icon: <Brain className="text-sidebar-primary h-5 w-5 flex-shrink-0" />,
    },
  ]

  return (
    <Suspense fallback={<Loading />}>
      <div
        className={cn(
          "flex flex-col md:flex-row bg-surface w-full flex-1 max-w-full mx-auto overflow-hidden animate-fade-in",
          "h-screen",
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 glass-effect">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                  >
                    <SidebarLink link={link} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent justify-start px-2 hover-lift transition-all-smooth"
              >
                <LogOut className="h-5 w-5 text-sidebar-primary" />
                {open && <span>Logout</span>}
              </Button>
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="flex flex-1 overflow-hidden">
          <div className="p-4 md:p-8 flex flex-col gap-6 flex-1 w-full h-full overflow-y-auto bg-surface">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}


