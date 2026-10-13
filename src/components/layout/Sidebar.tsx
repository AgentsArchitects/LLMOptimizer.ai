"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderKanban, 
  Search, 
  LineChart, 
  HeartPulse, 
  FileText, 
  CheckSquare, 
  FileBarChart,
  Blocks,
  Users,
  CreditCard,
  Settings,
  Bot
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ChevronDown, Plus } from "lucide-react"

const navigation = [
  { name: "Overview", href: "/app", icon: LayoutDashboard },
  { name: "Projects", href: "/app/projects", icon: FolderKanban },
  { name: "AI Visibility", href: "/app/ai-visibility", icon: Search },
  { name: "SEO Intelligence", href: "/app/seo", icon: LineChart },
  { name: "Technical Health", href: "/app/technical-health", icon: HeartPulse },
  { name: "Content & Sources", href: "/app/content", icon: FileText },
  { name: "Actions", href: "/app/actions", icon: CheckSquare },
  { name: "Reports", href: "/app/reports", icon: FileBarChart },
]

const workspaceNavigation = [
  { name: "Integrations", href: "/app/integrations", icon: Blocks },
  { name: "Team & Clients", href: "/app/team", icon: Users },
  { name: "Billing & Usage", href: "/app/billing", icon: CreditCard },
  { name: "Settings", href: "/app/settings", icon: Settings },
]

const adminNavigation = [
  { name: "Agent Console", href: "/admin/agents", icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()
  
  const [projects, setProjects] = React.useState<any[]>([])
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects)
          const saved = localStorage.getItem('llm_active_project_id')
          if (saved && data.projects.find((p: any) => p.id === saved)) {
            setActiveProjectId(saved)
          } else {
            setActiveProjectId(data.projects[0].id)
            localStorage.setItem('llm_active_project_id', data.projects[0].id)
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value
    setActiveProjectId(newId)
    localStorage.setItem('llm_active_project_id', newId)
    window.dispatchEvent(new Event('llm_project_changed')) // trigger updates across app
  }
  
  const renderLinks = (items: typeof navigation) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/app" && item.href !== "/admin")
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} aria-hidden="true" />
              {item.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-card lg:pb-4">
      <div className="flex h-16 shrink-0 items-center px-6 font-bold text-lg tracking-tight">
        <div className="mr-3 h-6 w-6 rounded bg-gradient-to-br from-brand to-purple-600"></div>
        LLMOptimizer.ai
      </div>

      <div className="px-4 pb-4">
        <div className="bg-muted/50 rounded-lg border border-border p-2">
          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 px-1">Active Project</p>
          <div className="relative">
            <select 
              value={activeProjectId || ''} 
              onChange={handleProjectChange}
              className="w-full bg-transparent text-sm font-semibold text-foreground appearance-none outline-none cursor-pointer px-1 pr-6"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              {projects.length === 0 && <option value="">No projects found</option>}
            </select>
            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-4 scrollbar-hide">
        <div className="flex flex-1 flex-col gap-y-7">
          <div>
            <div className="text-xs font-semibold leading-6 text-muted-foreground mb-2 px-2 uppercase tracking-wider">Project Intelligence</div>
            {renderLinks(navigation)}
          </div>
          <div>
            <div className="text-xs font-semibold leading-6 text-muted-foreground mb-2 px-2 uppercase tracking-wider">Workspace</div>
            {renderLinks(workspaceNavigation)}
          </div>
          <div>
            <div className="text-xs font-semibold leading-6 text-muted-foreground mb-2 px-2 uppercase tracking-wider">Admin</div>
            {renderLinks(adminNavigation)}
          </div>
        </div>
      </nav>
    </div>
  )
}
