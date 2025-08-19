"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import Link from "next/link"

export const Logo = () => {
  return (
    <Link href="/dashboard" className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20 hover-lift">
      <div className="h-8 w-8 bg-sidebar-primary rounded-lg flex-shrink-0 flex items-center justify-center shadow-md">
        <Trophy className="h-4 w-4 text-sidebar-primary-foreground" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-sidebar-foreground whitespace-pre text-lg"
      >
        Squash Dashboard
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link href="/dashboard" className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20 hover-lift">
      <div className="h-8 w-8 bg-sidebar-primary rounded-lg flex-shrink-0 flex items-center justify-center shadow-md">
        <Trophy className="h-4 w-4 text-sidebar-primary-foreground" />
      </div>
    </Link>
  )
}