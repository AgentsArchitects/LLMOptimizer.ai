"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  FileText, 
  ExternalLink, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowUpRight, 
  Globe, 
  Layers, 
  BookmarkCheck, 
  Plus, 
  Clock, 
  BarChart2,
  Check
} from "lucide-react"

interface CitationSource {
  id: string;
  domain: string;
  type: 'Directory & Reviews' | 'Editorial & Media' | 'Community & Forums' | 'Encyclopedia';
  llmTrustScore: number;
  citedBy: string[]; // e.g. ['ChatGPT', 'Claude', 'Perplexity', 'Gemini']
  truefirmsStatus: 'Active Listing' | 'Missing Listing' | 'Unclaimed Profile';
  competitorPresence: string;
  actionRequired?: string;
}

const DEFAULT_SOURCES: CitationSource[] = [
  {
    id: "src-1",
    domain: "clutch.co",
    type: "Directory & Reviews",
    llmTrustScore: 98,
    citedBy: ["ChatGPT", "Claude", "Gemini", "Perplexity"],
    truefirmsStatus: "Active Listing",
    competitorPresence: "Dominant (5,000+ reviews)",
    actionRequired: "Enhance verified client reviews on Clutch to increase citation weight."
  },
  {
    id: "src-2",
    domain: "goodfirms.co",
    type: "Directory & Reviews",
    llmTrustScore: 92,
    citedBy: ["ChatGPT", "Gemini", "Perplexity"],
    truefirmsStatus: "Active Listing",
    competitorPresence: "High (3,200+ reviews)",
    actionRequired: "Maintain active vendor profile and feature badges."
  },
  {
    id: "src-3",
    domain: "g2.com",
    type: "Directory & Reviews",
    llmTrustScore: 96,
    citedBy: ["ChatGPT", "Claude", "Perplexity"],
    truefirmsStatus: "Unclaimed Profile",
    competitorPresence: "Very High",
    actionRequired: "Claim official Truefirms product profile on G2."
  },
  {
    id: "src-4",
    domain: "reddit.com/r/webdev",
    type: "Community & Forums",
    llmTrustScore: 89,
    citedBy: ["Perplexity", "ChatGPT Search", "Gemini"],
    truefirmsStatus: "Missing Listing",
    competitorPresence: "Toptal & Clutch cited in 14 threads",
    actionRequired: "Participate in organic discussion threads comparing B2B directories."
  },
  {
    id: "src-5",
    domain: "techradar.com",
    type: "Editorial & Media",
    llmTrustScore: 94,
    citedBy: ["ChatGPT", "Claude"],
    truefirmsStatus: "Missing Listing",
    competitorPresence: "Clutch & Upwork featured in 'Best Freelance Sites 2026'",
    actionRequired: "Pitch digital PR roundup inclusion for modern B2B vetting platforms."
  },
  {
    id: "src-6",
    domain: "wikipedia.org",
    type: "Encyclopedia",
    llmTrustScore: 99,
    citedBy: ["ChatGPT", "Claude", "Gemini", "Perplexity"],
    truefirmsStatus: "Missing Listing",
    competitorPresence: "Clutch has dedicated entity page",
    actionRequired: "Build notable third-party press coverage to qualify for entity citation."
  }
];

const DECAY_PAGES = [
  {
    url: "/company-search/Staff-Augmentation",
    title: "Top Staff Augmentation Companies",
    impressionsChange: "-12.4%",
    clicksChange: "-8.1%",
    lastUpdated: "4 months ago",
    aiRecommendationRisk: "High (Gemini shifted citations to Toptal)",
    fix: "Update 2026 pricing benchmarks, add verified company reviews, and embed FAQ schema."
  },
  {
    url: "/blogs/top-web-development-firms",
    title: "Best Web Development Companies 2025",
    impressionsChange: "-24.0%",
    clicksChange: "-15.2%",
    lastUpdated: "9 months ago",
    aiRecommendationRisk: "Critical (Outdated year in title & content)",
    fix: "Refresh title to 2026, re-verify featured agencies, and republish with updated date."
  }
];

export default function ContentSourcesPage() {
  const [sources, setSources] = useState<CitationSource[]>(DEFAULT_SOURCES)
  const [activeTab, setActiveTab] = useState("sources")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setToastMessage("Source citation analysis updated across OpenAI, Gemini & Claude models!")
      setTimeout(() => setToastMessage(null), 3500)
    }, 1200)
  }

  const handlePushToActionCenter = (itemTitle: string) => {
    // Read current actions
    const currentActions = localStorage.getItem("llm_project_actions")
    let list: any[] = []
    if (currentActions) {
      try { list = JSON.parse(currentActions) } catch (e) {}
    }

    const newAct = {
      id: `act-${Date.now()}`,
      title: itemTitle,
      category: "AEO & Citations",
      evidence: "Identified via Citation Gap Analysis. High-trust source frequently referenced by ChatGPT & Claude.",
      impact: "+18% AI recommendation visibility",
      confidence: "High",
      effort: "M",
      ice: 8.4,
      owner: "Content Team",
      status: "Awaiting approval",
      source: "AI Engines"
    }

    const updated = [newAct, ...list]
    localStorage.setItem("llm_project_actions", JSON.stringify(updated))
    setToastMessage(`Pushed "${itemTitle.slice(0, 32)}..." to Action Center!`)
    setTimeout(() => setToastMessage(null), 3000)
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Content & AI Sources</h1>
            <Badge variant="brand" className="text-[11px] font-medium">
              Citation Footprint & Decay
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Monitor the third-party platforms that LLMs (ChatGPT, Gemini, Claude, Perplexity) cite to recommend B2B vendors and detect content decay.
          </p>
        </div>

        <Button 
          onClick={handleScan}
          disabled={scanning}
          className="gap-2 bg-brand hover:bg-brand/90 text-white"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning Sources..." : "Scan Citation Sources"}
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Authority Sources</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">{sources.length} Monitored</span>
            <Badge variant="outline" className="text-[10px]">Tier 1</Badge>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand Citation Presence</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-positive">
              {sources.filter(s => s.truefirmsStatus === 'Active Listing').length} / {sources.length}
            </span>
            <span className="text-xs text-muted-foreground">33% Coverage</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">High Impact Gaps</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-warning">
              {sources.filter(s => s.truefirmsStatus !== 'Active Listing').length}
            </span>
            <span className="text-xs text-warning font-medium">Actionable</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content Decay Alerts</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-destructive">2 Pages</span>
            <span className="text-xs text-destructive font-medium">Needs 2026 Refresh</span>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center border-b pb-3">
          <TabsList>
            <TabsTrigger value="sources">Citation Sources ({sources.length})</TabsTrigger>
            <TabsTrigger value="gaps">Citation Gap Opportunities ({sources.filter(s => s.truefirmsStatus !== 'Active Listing').length})</TabsTrigger>
            <TabsTrigger value="decay">Content Freshness & Decay (2)</TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: ALL SOURCES */}
        <TabsContent value="sources" className="mt-6">
          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Source Domain</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">LLM Trust Score</th>
                  <th className="p-3">Citing AI Engines</th>
                  <th className="p-3">Truefirms Presence</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sources.map((src) => (
                  <tr key={src.id} className="hover:bg-muted/30">
                    <td className="p-3 font-semibold text-foreground flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      {src.domain}
                    </td>
                    <td className="p-3 text-muted-foreground">{src.type}</td>
                    <td className="p-3">
                      <span className="font-bold text-brand">{src.llmTrustScore} / 100</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {src.citedBy.map((eng, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0">
                            {eng}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        src.truefirmsStatus === 'Active Listing' ? 'positive' :
                        src.truefirmsStatus === 'Unclaimed Profile' ? 'warning' : 'destructive'
                      } className="text-[10px]">
                        {src.truefirmsStatus}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {src.truefirmsStatus !== 'Active Listing' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePushToActionCenter(`Claim & optimize profile on ${src.domain}`)}
                          className="text-[11px] h-7 gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Action
                        </Button>
                      ) : (
                        <span className="text-positive text-[11px] font-medium flex items-center justify-end gap-1">
                          <Check className="w-3 h-3" /> Monitored
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 2: CITATION GAPS */}
        <TabsContent value="gaps" className="mt-6 space-y-4">
          <div className="p-4 bg-muted/40 rounded-lg border border-border flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-foreground">What is a Citation Gap?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Frontier LLMs (ChatGPT, Claude, Gemini) rely on external web citations to recommend vendors. When competitors are featured on an authority domain where Truefirms is missing, AI models will recommend them instead.
              </p>
            </div>
            <Link href="/app/actions">
              <Button variant="outline" size="sm" className="text-xs gap-1 shrink-0">
                Go to Action Center
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sources.filter(s => s.truefirmsStatus !== 'Active Listing').map((src) => (
              <Card key={src.id} className="p-4 border border-border flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-warning/10 text-warning rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{src.domain}</h4>
                        <p className="text-xs text-muted-foreground">{src.type}</p>
                      </div>
                    </div>
                    <Badge variant="warning" className="text-xs">
                      Gap Detected
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs mt-3">
                    <p className="text-muted-foreground">
                      <strong>Competitor Advantage:</strong> {src.competitorPresence}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Recommended Strategy:</strong> {src.actionRequired}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t mt-4 flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">
                    LLM Authority: <strong className="text-brand">{src.llmTrustScore}/100</strong>
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => handlePushToActionCenter(`Bridge citation gap on ${src.domain}`)}
                    className="text-xs h-7 gap-1 bg-brand hover:bg-brand/90 text-white"
                  >
                    <Plus className="w-3 h-3" />
                    Push to Action Center
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: CONTENT DECAY */}
        <TabsContent value="decay" className="mt-6 space-y-4">
          <div className="grid gap-4">
            {DECAY_PAGES.map((page, idx) => (
              <Card key={idx} className="p-5 border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{page.title}</h3>
                    <code className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{page.url}</code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-destructive">{page.aiRecommendationRisk}</strong> — {page.fix}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                    <span>GSC Impressions: <strong className="text-destructive">{page.impressionsChange}</strong></span>
                    <span>Clicks: <strong className="text-destructive">{page.clicksChange}</strong></span>
                    <span>Last Updated: <strong>{page.lastUpdated}</strong></span>
                  </div>
                </div>

                <Button 
                  size="sm"
                  onClick={() => handlePushToActionCenter(`Refresh decaying content for '${page.title}'`)}
                  className="gap-1.5 text-xs bg-brand hover:bg-brand/90 text-white shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Refresh Action
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
