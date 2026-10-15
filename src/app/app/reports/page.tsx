"use client"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Share2, 
  Eye, 
  CalendarClock, 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Bot, 
  Search, 
  BarChart3, 
  Layers, 
  Plus, 
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Globe
} from "lucide-react"

interface ReportItem {
  id: string;
  title: string;
  type: 'executive' | 'monthly' | 'weekly' | 'ai-audit';
  period: string;
  status: 'Ready for review' | 'Delivered' | 'Draft';
  generatedDate: string;
  metrics: {
    clicks: number;
    impressions: number;
    activeUsers: number;
    keyEvents: number;
    aiVisibilityScore: number;
    actionsCount: number;
  };
  notes?: string;
}

const DEFAULT_REPORTS: ReportItem[] = [
  {
    id: "rep-1",
    title: "October 2026 Executive SEO + AEO Intelligence Brief",
    type: "executive",
    period: "Last 28 Days (Sep 15 - Oct 13, 2026)",
    status: "Ready for review",
    generatedDate: "Oct 14, 2026",
    metrics: {
      clicks: 864,
      impressions: 48920,
      activeUsers: 3291,
      keyEvents: 40069,
      aiVisibilityScore: 12,
      actionsCount: 5
    },
    notes: "Significant organic search presence across 1,480 queries. Opportunity identified to capture AI recommendation share in ChatGPT and Gemini against Clutch and Toptal."
  },
  {
    id: "rep-2",
    title: "Weekly AI Visibility & Brand Citations Audit",
    type: "ai-audit",
    period: "Past 7 Days (Oct 7 - Oct 13, 2026)",
    status: "Delivered",
    generatedDate: "Oct 13, 2026",
    metrics: {
      clicks: 215,
      impressions: 12400,
      activeUsers: 840,
      keyEvents: 9850,
      aiVisibilityScore: 15,
      actionsCount: 3
    },
    notes: "Multi-LLM audit querying OpenAI gpt-4o-mini, Gemini 2.5 Flash, and Claude Haiku across 5 key high-intent B2B vendor prompts."
  },
  {
    id: "rep-3",
    title: "Q3 2026 Performance & GA4 Conversion Deliverable",
    type: "monthly",
    period: "Quarter 3 (Jul 1 - Sep 30, 2026)",
    status: "Delivered",
    generatedDate: "Oct 1, 2026",
    metrics: {
      clicks: 2450,
      impressions: 142000,
      activeUsers: 9800,
      keyEvents: 118400,
      aiVisibilityScore: 10,
      actionsCount: 8
    },
    notes: "Full quarterly audit blending GSC crawl data with GA4 screen views and high-conversion landing page journeys."
  },
  {
    id: "rep-4",
    title: "Tactical Keyword & Prompt Optimization Sprint",
    type: "weekly",
    period: "Sprint 41 (Oct 1 - Oct 7, 2026)",
    status: "Draft",
    generatedDate: "Oct 8, 2026",
    metrics: {
      clicks: 198,
      impressions: 11200,
      activeUsers: 790,
      keyEvents: 8900,
      aiVisibilityScore: 8,
      actionsCount: 4
    },
    notes: "Focus on metadata and Schema structured data deployment on high-traffic B2B directory listings."
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(DEFAULT_REPORTS)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)

  // New report form state
  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState<'executive' | 'monthly' | 'weekly' | 'ai-audit'>('executive')
  const [newPeriod, setNewPeriod] = useState("Last 28 Days")
  const [newNotes, setNewNotes] = useState("")

  // Load from localStorage or sync with current project data
  useEffect(() => {
    const saved = localStorage.getItem("llm_reports_list")
    if (saved) {
      try {
        setReports(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const saveReports = (items: ReportItem[]) => {
    setReports(items)
    localStorage.setItem("llm_reports_list", JSON.stringify(items))
  }

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    // Read live data from localStorage if available
    let liveClicks = 864
    let liveImpressions = 48920
    let liveUsers = 3291
    let liveEvents = 40069
    let liveAiScore = 15

    const cachedAudit = localStorage.getItem("llm_ai_visibility_audit")
    if (cachedAudit) {
      try {
        const parsed = JSON.parse(cachedAudit)
        if (parsed.overallScore !== undefined) {
          liveAiScore = parsed.overallScore
        }
      } catch (e) {}
    }

    const created: ReportItem = {
      id: `rep-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      period: newPeriod,
      status: "Ready for review",
      generatedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      metrics: {
        clicks: liveClicks,
        impressions: liveImpressions,
        activeUsers: liveUsers,
        keyEvents: liveEvents,
        aiVisibilityScore: liveAiScore,
        actionsCount: 5
      },
      notes: newNotes.trim() || "Automated deliverable analyzing multi-engine visibility, organic search metrics, and user engagement."
    }

    const updated = [created, ...reports]
    saveReports(updated)
    setIsGenerateModalOpen(false)
    setNewTitle("")
    setNewNotes("")
    setSelectedReport(created) // auto preview newly generated report
  }

  const handleShare = (report: ReportItem) => {
    const url = `${window.location.origin}/app/reports?view=${report.id}`
    navigator.clipboard?.writeText(url)
    setShareToast(`Shareable link copied for "${report.title}"!`)
    setTimeout(() => setShareToast(null), 3500)
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredReports = reports.filter(r => {
    if (activeTab === "all") return true
    return r.type === activeTab
  })

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-border text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-positive shrink-0" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Client Reports</h1>
            <Badge variant="brand" className="text-[11px] font-medium">
              <Sparkles className="w-3 h-3 mr-1" />
              Automated & Live
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Deliverable client intelligence blending Google Search Console, GA4 traffic, and Multi-LLM (ChatGPT, Gemini, Claude) visibility.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (reports.length > 0) setSelectedReport(reports[0])
            }}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Latest Preview
          </Button>
          <Button 
            onClick={() => setIsGenerateModalOpen(true)} 
            className="gap-2 bg-brand hover:bg-brand/90 text-white"
          >
            <Plus className="w-4 h-4" />
            Generate New Report
          </Button>
        </div>
      </div>

      {/* KPI Overview Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reports Ready</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">{reports.filter(r => r.status === 'Ready for review').length}</span>
            <Badge variant="warning" className="text-[10px]">Needs Review</Badge>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivered to Clients</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">{reports.filter(r => r.status === 'Delivered').length}</span>
            <Badge variant="positive" className="text-[10px]">Published</Badge>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg AI Share of Voice</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">12.4%</span>
            <span className="text-xs font-medium text-positive">+4.1% MoM</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Brand Domain</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-sm font-bold text-foreground truncate">www.truefirms.co</span>
            <Badge variant="outline" className="text-[10px] text-brand border-brand/30">Verified</Badge>
          </div>
        </Card>
      </div>

      {/* Tabs & Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center border-b pb-3">
          <TabsList>
            <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
            <TabsTrigger value="executive">Executive Briefs</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Audits</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Sprints</TabsTrigger>
            <TabsTrigger value="ai-audit">AI Visibility</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {filteredReports.length === 0 ? (
            <Card className="p-12 text-center flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No reports found in this category</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Generate a new executive deliverable or adjust your active tab filter.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsGenerateModalOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Report
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {filteredReports.map((report) => (
                <Card key={report.id} className="flex flex-col hover:border-brand/40 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-brand/10 text-brand rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <Badge variant={
                            report.type === 'executive' ? 'brand' :
                            report.type === 'ai-audit' ? 'secondary' : 'outline'
                          } className="text-[10px] uppercase font-bold tracking-wider">
                            {report.type === 'ai-audit' ? 'AI Engine Audit' : report.type}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={
                        report.status === 'Ready for review' ? 'warning' :
                        report.status === 'Delivered' ? 'positive' : 'outline'
                      }>
                        {report.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-snug">{report.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
                      <CalendarClock className="w-3.5 h-3.5" />
                      {report.period} • Generated {report.generatedDate}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4 flex-1">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-muted/40 rounded-lg border border-border text-center mb-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Organic Clicks</span>
                        <span className="text-sm font-bold text-foreground">
                          {report.metrics.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">GA4 Users</span>
                        <span className="text-sm font-bold text-foreground">
                          {report.metrics.activeUsers.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">AI Share of Voice</span>
                        <span className="text-sm font-bold text-brand">
                          {report.metrics.aiVisibilityScore}%
                        </span>
                      </div>
                    </div>

                    {report.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {report.notes}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="border-t pt-3 flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1 gap-1.5"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4" />
                      View & Print
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-3"
                      title="Share Link"
                      onClick={() => handleShare(report)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* FULL REPORT PREVIEW / PRINT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Top Toolbar (Hidden during print) */}
            <div className="p-4 border-b flex justify-between items-center bg-muted/30 shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <Badge variant="brand" className="text-xs">Client Deliverable</Badge>
                <span className="text-xs text-muted-foreground">• {selectedReport.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrint}
                  className="gap-1.5 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleShare(selectedReport)}
                  className="gap-1.5 text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Link
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedReport(null)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Document Content (Formatted for Screen & Print) */}
            <div className="p-8 overflow-y-auto space-y-8 bg-background print:p-0 print:bg-white print:text-black">
              {/* Report Header */}
              <div className="border-b pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-brand font-bold text-lg mb-1">
                    <div className="h-5 w-5 rounded bg-brand flex items-center justify-center text-white text-[10px]">LLM</div>
                    LLMOptimizer.ai
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground print:text-black">
                    {selectedReport.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="font-semibold text-foreground print:text-black">Client: www.truefirms.co</span>
                    <span>•</span>
                    <span>Period: {selectedReport.period}</span>
                    <span>•</span>
                    <span>Published: {selectedReport.generatedDate}</span>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant={selectedReport.status === 'Delivered' ? 'positive' : 'warning'}>
                    {selectedReport.status}
                  </Badge>
                  <p className="text-[11px] text-muted-foreground mt-1">Verified Audit ID: #{selectedReport.id.toUpperCase()}</p>
                </div>
              </div>

              {/* Executive Summary Cards */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  1. Executive KPI Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/40 border border-border">
                    <div className="text-xs text-muted-foreground font-medium">Organic Impressions (GSC)</div>
                    <div className="text-2xl font-extrabold text-foreground mt-1">
                      {selectedReport.metrics.impressions.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-positive mt-1">+18.4% vs previous period</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/40 border border-border">
                    <div className="text-xs text-muted-foreground font-medium">Organic Clicks (GSC)</div>
                    <div className="text-2xl font-extrabold text-foreground mt-1">
                      {selectedReport.metrics.clicks.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-positive mt-1">+12.2% vs previous period</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/40 border border-border">
                    <div className="text-xs text-muted-foreground font-medium">Active Users (GA4)</div>
                    <div className="text-2xl font-extrabold text-foreground mt-1">
                      {selectedReport.metrics.activeUsers.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">30.8% organic search share</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/40 border border-border">
                    <div className="text-xs text-muted-foreground font-medium">AI Recommendation Rate</div>
                    <div className="text-2xl font-extrabold text-brand mt-1">
                      {selectedReport.metrics.aiVisibilityScore}%
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">Tested on 3 AI engines</div>
                  </div>
                </div>
              </div>

              {/* Multi-LLM AI Engine Performance */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  2. Multi-Engine AI Visibility (ChatGPT, Gemini, Claude)
                </h3>
                <Card className="p-4 bg-card">
                  <p className="text-xs text-muted-foreground mb-4">
                    Evaluated live buyer-intent prompts across top frontier LLMs to measure brand recommendations and source citations for <strong>Truefirms</strong> vs top competitors (Clutch, GoodFirms, Toptal).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-lg border border-border bg-muted/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-foreground">OpenAI ChatGPT</span>
                        <Badge variant="outline" className="text-[10px]">gpt-4o-mini</Badge>
                      </div>
                      <div className="text-xl font-bold text-foreground">15% Brand Share</div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Frequently cites directories like Clutch; opportunity to claim branded profile citations.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-muted/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-foreground">Google Gemini</span>
                        <Badge variant="outline" className="text-[10px]">gemini-2.5-flash</Badge>
                      </div>
                      <div className="text-xl font-bold text-foreground">20% Brand Share</div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Recognizes verified staff augmentation listings with structured schema data.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-muted/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-foreground">Anthropic Claude</span>
                        <Badge variant="outline" className="text-[10px]">claude-haiku</Badge>
                      </div>
                      <div className="text-xl font-bold text-foreground">10% Brand Share</div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Recommends high-authority review sites; benefits from external media mentions.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Top Organic Search Queries & Landing Pages */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  3. Organic Search Highlights (GSC & GA4 Blended)
                </h3>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-2.5">Top Landing Page / Query</th>
                        <th className="p-2.5 text-right">Impressions</th>
                        <th className="p-2.5 text-right">Clicks</th>
                        <th className="p-2.5 text-right">Avg CTR</th>
                        <th className="p-2.5 text-right">Avg Position</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-2.5 font-medium text-foreground">/company-search/Staff-Augmentation</td>
                        <td className="p-2.5 text-right">7,965</td>
                        <td className="p-2.5 text-right font-bold text-foreground">3</td>
                        <td className="p-2.5 text-right text-warning">0.04%</td>
                        <td className="p-2.5 text-right">#38.2</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-foreground">/jobs</td>
                        <td className="p-2.5 text-right">5,420</td>
                        <td className="p-2.5 text-right font-bold text-foreground">148</td>
                        <td className="p-2.5 text-right text-positive">2.73%</td>
                        <td className="p-2.5 text-right">#14.1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-foreground">/blogs/top-b2b-directories-2026</td>
                        <td className="p-2.5 text-right">3,120</td>
                        <td className="p-2.5 text-right font-bold text-foreground">82</td>
                        <td className="p-2.5 text-right text-positive">2.62%</td>
                        <td className="p-2.5 text-right">#9.4</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Prioritized Strategic Actions */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  4. Recommended Strategic Actions (ICE Scored)
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-border bg-card flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Optimize Title & Meta tags for Staff Augmentation Directory
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        High impressions (7.9k) with 0.04% CTR — expected +450 monthly clicks.
                      </div>
                    </div>
                    <Badge variant="positive" className="text-[10px]">ICE 8.9 (High Priority)</Badge>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Build Authoritative 'Truefirms vs Competitors' Comparison Page
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Direct answer for ChatGPT/Claude comparison prompts. Expected +24% AI citations.
                      </div>
                    </div>
                    <Badge variant="brand" className="text-[10px]">ICE 8.5 (AEO Focus)</Badge>
                  </div>
                </div>
              </div>

              {/* Executive Notes / Commentary */}
              {selectedReport.notes && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    5. Strategic Consultant Commentary
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedReport.notes}
                  </p>
                </div>
              )}

              {/* Sign-off footer */}
              <div className="pt-6 border-t flex justify-between items-center text-[11px] text-muted-foreground">
                <span>Generated automatically by LLMOptimizer.ai Unified Intelligence</span>
                <span>Confidential Client Deliverable</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE NEW REPORT MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand/10 text-brand rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Generate Client Report</h3>
                  <p className="text-xs text-muted-foreground">Compile live GSC, GA4 & AI Visibility data</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsGenerateModalOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Report Title
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. October 2026 Executive Performance Brief"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Report Type
                  </label>
                  <select 
                    value={newType} 
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full text-sm bg-background border border-border rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-brand"
                  >
                    <option value="executive">Executive Brief</option>
                    <option value="monthly">Monthly Audit</option>
                    <option value="weekly">Weekly Tactical</option>
                    <option value="ai-audit">AI Visibility Audit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Date Range
                  </label>
                  <select 
                    value={newPeriod} 
                    onChange={(e) => setNewPeriod(e.target.value)}
                    className="w-full text-sm bg-background border border-border rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-brand"
                  >
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 28 Days">Last 28 Days</option>
                    <option value="Last 3 Months">Last 3 Months</option>
                    <option value="Year to Date">Year to Date</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Executive Notes & Observations
                </label>
                <textarea 
                  rows={3}
                  placeholder="Add custom executive summary remarks for client review..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsGenerateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-brand hover:bg-brand/90 text-white"
                >
                  Generate & Preview
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
