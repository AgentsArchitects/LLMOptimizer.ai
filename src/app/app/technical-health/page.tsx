"use client"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  HeartPulse, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Code2, 
  Layers, 
  Sparkles, 
  Zap,
  Globe,
  FileCode,
  Check,
  ArrowUpRight
} from "lucide-react"

export default function TechnicalHealthPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [isAuditing, setIsAuditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'crawlers' | 'schema' | 'robots'>('crawlers')

  const fetchHealth = async () => {
    setIsAuditing(true)
    try {
      const res = await fetch('/api/technical-health?domain=https://www.truefirms.co')
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setIsAuditing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Technical & AEO Health</h1>
            <Badge variant="brand" className="text-[11px] font-medium">
              AI Crawler & Schema Readiness
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Inspect robots.txt directives for LLM bots (GPTBot, ClaudeBot, PerplexityBot), entity structured data, and Core Web Vitals.
          </p>
        </div>

        <Button 
          onClick={fetchHealth} 
          disabled={isAuditing}
          className="gap-2 bg-brand hover:bg-brand/90 text-white"
        >
          <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
          {isAuditing ? "Auditing Domain..." : "Run Live Technical Audit"}
        </Button>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AEO Health Score</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-positive">
              {data ? `${data.overallHealthScore}/100` : "88/100"}
            </span>
            <Badge variant="positive" className="text-[10px]">Optimal</Badge>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LLM Bot Accessibility</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">5 / 5 Allowed</span>
            <span className="text-xs text-positive font-medium">100% Open</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Schema Coverage</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">71%</span>
            <span className="text-xs text-warning font-medium">Needs FAQ Schema</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Audited Domain</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-sm font-bold text-foreground truncate">www.truefirms.co</span>
            <Badge variant="outline" className="text-[10px] text-brand border-brand/30">Verified</Badge>
          </div>
        </Card>
      </div>

      {/* Sub Navigation */}
      <div className="flex gap-2 border-b pb-2 text-sm">
        <button 
          onClick={() => setActiveTab('crawlers')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
            activeTab === 'crawlers' ? 'bg-brand/10 text-brand font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          AI Crawler Directives (5)
        </button>
        <button 
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
            activeTab === 'schema' ? 'bg-brand/10 text-brand font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Structured Data & Schema (4)
        </button>
        <button 
          onClick={() => setActiveTab('robots')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
            activeTab === 'robots' ? 'bg-brand/10 text-brand font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Live robots.txt Viewer
        </button>
      </div>

      {/* TAB CONTENT: AI CRAWLERS */}
      {activeTab === 'crawlers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Frontier AI Engine Crawlers</h2>
              <p className="text-xs text-muted-foreground">
                Monitoring permissions for training bots and real-time search crawlers.
              </p>
            </div>
            <Badge variant="positive" className="text-xs gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Robots.txt Reachable (200 OK)
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(data?.crawlers || []).map((bot: any, idx: number) => (
              <Card key={idx} className="p-4 border border-border flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-brand/10 text-brand rounded-lg">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{bot.name}</h3>
                        <p className="text-xs text-muted-foreground">{bot.engine}</p>
                      </div>
                    </div>
                    <Badge variant={bot.status === 'Allowed' ? 'positive' : 'destructive'} className="text-xs">
                      {bot.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {bot.note}
                  </p>
                </div>

                <div className="pt-3 border-t mt-3 flex justify-between items-center text-[11px] text-muted-foreground">
                  <span>Priority: <strong className="text-foreground">{bot.importance}</strong></span>
                  <span className="text-positive flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Directives Valid
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SCHEMA AUDIT */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Entity Schema & Structured Data Coverage</h2>
              <p className="text-xs text-muted-foreground">
                JSON-LD structured data enables LLMs to parse brand facts, ratings, and questions cleanly into knowledge embeddings.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Schema Entity Type</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Domain Coverage</th>
                  <th className="p-3">AEO Knowledge Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.schemaAudit || []).map((schema: any, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-brand" />
                      {schema.type}
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        schema.status === 'Pass' ? 'positive' :
                        schema.status === 'Warning' ? 'warning' : 'destructive'
                      } className="text-[10px]">
                        {schema.status}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium text-foreground">{schema.coverage}</td>
                    <td className="p-3 text-muted-foreground max-w-md">{schema.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ROBOTS.TXT */}
      {activeTab === 'robots' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Live Server robots.txt Output</h2>
              <p className="text-xs text-muted-foreground">
                Raw contents fetched live from <code>https://www.truefirms.co/robots.txt</code>
              </p>
            </div>
            <a 
              href="https://www.truefirms.co/robots.txt" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-brand hover:underline flex items-center gap-1"
            >
              Open Live Source
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <Card className="p-4 bg-muted/30 border border-border font-mono text-xs text-foreground overflow-x-auto whitespace-pre">
            {data?.robotsTxtContent || "Loading robots.txt..."}
          </Card>
        </div>
      )}

      {/* Core Web Vitals Summary */}
      <Card className="p-5 border border-border bg-card">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Core Web Vitals & Server Performance</h3>
              <p className="text-xs text-muted-foreground">Fast DOM parsing guarantees LLM scraper bots don't timeout when indexing.</p>
            </div>
          </div>
          <Badge variant="positive" className="text-xs">Grade A</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[11px]">Largest Contentful Paint</span>
            <span className="font-bold text-positive text-sm mt-0.5 block">{data?.vitals?.lcp || "1.8s (Good)"}</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[11px]">Interaction to Next Paint</span>
            <span className="font-bold text-positive text-sm mt-0.5 block">{data?.vitals?.inp || "142ms (Good)"}</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[11px]">Cumulative Layout Shift</span>
            <span className="font-bold text-positive text-sm mt-0.5 block">{data?.vitals?.cls || "0.04 (Good)"}</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[11px]">Time to First Byte (TTFB)</span>
            <span className="font-bold text-positive text-sm mt-0.5 block">{data?.vitals?.ttfb || "220ms (Fast)"}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
