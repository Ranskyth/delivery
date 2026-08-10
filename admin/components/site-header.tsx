"use client"

import { useTheme } from "@/components/theme-provider"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{""}</h1>
        <div className="ml-auto">
          <AnimatedThemeToggler/>
        </div>
      </div>
    </header>
  )
}
