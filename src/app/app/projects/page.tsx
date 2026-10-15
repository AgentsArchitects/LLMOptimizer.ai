"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FolderKanban, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Globe, 
  Search, 
  LineChart, 
  Layers, 
  Sparkles, 
  Bot, 
  Settings, 
  ArrowRight,
  ShieldCheck,
  X,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from "lucide-react"

interface ProjectItem {
  id: string;
  name: string;
  domain: string;
  gscProperty?: string;
  ga4PropertyId?: string;
  competitors: string[];
  country: string;
  isDefault?: boolean;
  metrics: {
    clicks: number;
    impressions: number;
    activeUsers: number;
    aiScore: number;
  };
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "8f36535c-6f66-48a3-82a1-eb5f97ce9d66",
    name: "TRUE FIRMS BRAND NAME",
    domain: "https://www.truefirms.co/",
    gscProperty: "https://www.truefirms.co/",
    ga4PropertyId: "properties/321056997",
    competitors: ["clutch.co", "goodfirms.co", "toptal.com"],
    country: "United States & Global",
    isDefault: true,
    metrics: {
      clicks: 864,
      impressions: 48920,
      activeUsers: 3291,
      aiScore: 12
    }
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS)
  const [activeProjectId, setActiveProjectId] = useState<string>("8f36535c-6f66-48a3-82a1-eb5f97ce9d66")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // New Project Form
  const [newName, setNewName] = useState("")
  const [newDomain, setNewDomain] = useState("")
  const [newCompetitors, setNewCompetitors] = useState("")
  const [newCountry, setNewCountry] = useState("United States & Global")
  const [newGsc, setNewGsc] = useState("")
  const [newGa4, setNewGa4] = useState("")

  useEffect(() => {
    // Sync active project ID from localStorage
    const savedActive = localStorage.getItem("llm_active_project_id")
    if (savedActive) {
      setActiveProjectId(savedActive)
    }

    // Load persisted projects
    const savedProjects = localStorage.getItem("llm_user_projects")
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects))
      } catch (e) {}
    }

    // Try fetching from server API if user has session
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects && data.projects.length > 0) {
          const mapped: ProjectItem[] = data.projects.map((p: any) => ({
            id: p.id,
            name: p.name,
            domain: p.domain || (p.gsc_property ? p.gsc_property : "https://www.truefirms.co/"),
            gscProperty: p.gsc_property,
            ga4PropertyId: p.ga4_property_id,
            competitors: ["clutch.co", "goodfirms.co"],
            country: "Global",
            isDefault: p.id === "8f36535c-6f66-48a3-82a1-eb5f97ce9d66",
            metrics: {
              clicks: 864,
              impressions: 48920,
              activeUsers: 3291,
              aiScore: 12
            }
          }))
          setProjects(mapped)
          localStorage.setItem("llm_user_projects", JSON.stringify(mapped))
        }
      })
      .catch(() => {})
  }, [])

  const handleSetActive = (projectId: string, projectName: string) => {
    setActiveProjectId(projectId)
    localStorage.setItem("llm_active_project_id", projectId)
    window.dispatchEvent(new Event("llm_project_changed"))
    setToastMessage(`Switched active project to "${projectName}"!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newDomain.trim()) return

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newName.trim(),
      domain: newDomain.trim().startsWith("http") ? newDomain.trim() : `https://${newDomain.trim()}`,
      gscProperty: newGsc.trim() || undefined,
      ga4PropertyId: newGa4.trim() || undefined,
      competitors: newCompetitors.split(",").map(c => c.trim()).filter(Boolean),
      country: newCountry,
      metrics: {
        clicks: 0,
        impressions: 0,
        activeUsers: 0,
        aiScore: 0
      }
    }

    const updated = [...projects, newProject]
    setProjects(updated)
    localStorage.setItem("llm_user_projects", JSON.stringify(updated))
    handleSetActive(newProject.id, newProject.name)
    setIsModalOpen(false)

    // Reset Form
    setNewName("")
    setNewDomain("")
    setNewCompetitors("")
    setNewGsc("")
    setNewGa4("")
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-border text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects Hub</h1>
            <Badge variant="brand" className="text-[11px] font-medium">
              Multi-Client Architecture
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage tracked client websites, domain properties, GSC and GA4 connections, and AI Engine Optimization targets.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-brand hover:bg-brand/90 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Client Project
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tracked Projects</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">{projects.length}</span>
            <Badge variant="outline" className="text-[10px]">Active</Badge>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GSC Connected</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-positive">
              {projects.filter(p => !!p.gscProperty).length}
            </span>
            <span className="text-xs text-muted-foreground">/ {projects.length} domains</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GA4 Connected</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-positive">
              {projects.filter(p => !!p.ga4PropertyId).length}
            </span>
            <span className="text-xs text-muted-foreground">/ {projects.length} domains</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Engines Integrated</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-brand">3</span>
            <span className="text-xs text-brand font-medium">OpenAI • Gemini • Claude</span>
          </div>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          All Client Properties ({projects.length})
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const isActive = project.id === activeProjectId

            return (
              <Card 
                key={project.id} 
                className={`flex flex-col transition-all duration-200 ${
                  isActive 
                    ? "border-brand ring-1 ring-brand shadow-sm" 
                    : "hover:border-border/80"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${isActive ? "bg-brand text-white" : "bg-muted text-foreground"}`}>
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg leading-snug">{project.name}</CardTitle>
                          {isActive && (
                            <Badge variant="brand" className="text-[10px]">
                              Current Active
                            </Badge>
                          )}
                        </div>
                        <a 
                          href={project.domain} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-muted-foreground hover:text-brand flex items-center gap-1 mt-0.5"
                        >
                          {project.domain}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {!isActive ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetActive(project.id, project.name)}
                        className="text-xs h-8"
                      >
                        Switch Project
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-positive font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Active
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 pb-4">
                  {/* Integration Status Badges */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Google Search Console</span>
                      <span className={`font-semibold ${project.gscProperty ? "text-positive" : "text-muted-foreground"}`}>
                        {project.gscProperty ? "Connected" : "Not Linked"}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Google Analytics 4</span>
                      <span className={`font-semibold ${project.ga4PropertyId ? "text-positive" : "text-muted-foreground"}`}>
                        {project.ga4PropertyId ? "Connected" : "Not Linked"}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">AI Engines (AEO)</span>
                      <span className="font-semibold text-brand">3 Live</span>
                    </div>
                  </div>

                  {/* Metrics preview */}
                  <div className="grid grid-cols-4 gap-2 p-2.5 bg-muted/30 rounded-lg text-center border border-border">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Clicks</span>
                      <span className="text-xs font-bold text-foreground">
                        {project.metrics.clicks > 0 ? project.metrics.clicks.toLocaleString() : "Syncing"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Impressions</span>
                      <span className="text-xs font-bold text-foreground">
                        {project.metrics.impressions > 0 ? project.metrics.impressions.toLocaleString() : "Syncing"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Active Users</span>
                      <span className="text-xs font-bold text-foreground">
                        {project.metrics.activeUsers > 0 ? project.metrics.activeUsers.toLocaleString() : "Syncing"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">AI Score</span>
                      <span className="text-xs font-bold text-brand">
                        {project.metrics.aiScore > 0 ? `${project.metrics.aiScore}%` : "Auditing"}
                      </span>
                    </div>
                  </div>

                  {/* Competitors */}
                  {project.competitors && project.competitors.length > 0 && (
                    <div className="text-xs">
                      <span className="text-muted-foreground block text-[11px] mb-1">Monitored Competitors:</span>
                      <div className="flex flex-wrap gap-1">
                        {project.competitors.map((comp, idx) => (
                          <span key={idx} className="bg-muted px-2 py-0.5 rounded text-[11px] text-foreground">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t pt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link href="/app">
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        Overview
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Link href="/app/ai-visibility">
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        AI Visibility
                      </Button>
                    </Link>
                    <Link href="/app/seo">
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        SEO
                      </Button>
                    </Link>
                  </div>
                  
                  <Link href="/app/integrations">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Project Settings">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* CREATE NEW PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand/10 text-brand rounded-lg">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Add Client Project</h3>
                  <p className="text-xs text-muted-foreground">Track SEO, GA4 conversions, and AI engine recommendations</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Project / Brand Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Corporation"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Primary Website URL / Domain *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. https://www.acme.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    GSC Property URL
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://www.acme.com/"
                    value={newGsc}
                    onChange={(e) => setNewGsc(e.target.value)}
                    className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    GA4 Property ID
                  </label>
                  <input 
                    type="text" 
                    placeholder="properties/123456789"
                    value={newGa4}
                    onChange={(e) => setNewGa4(e.target.value)}
                    className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Competitors to Monitor in AI Prompts (comma separated)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. competitorA.com, competitorB.com"
                  value={newCompetitors}
                  onChange={(e) => setNewCompetitors(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Target Market / Geography
                </label>
                <select 
                  value={newCountry} 
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="United States & Global">United States & Global</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="European Union">European Union</option>
                  <option value="Canada & Australia">Canada & Australia</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-brand hover:bg-brand/90 text-white"
                >
                  Create & Activate Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
