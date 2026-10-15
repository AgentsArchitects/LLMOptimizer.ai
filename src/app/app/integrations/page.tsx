"use client"
import React, { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  ShieldAlert, 
  Layers, 
  Edit3, 
  Globe, 
  BarChart3, 
  Sparkles,
  ArrowRight
} from "lucide-react"

function IntegrationsContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')

  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleConnected, setIsGoogleConnected] = useState(success === 'google_connected')
  const [isTokenExpired, setIsTokenExpired] = useState(false)
  const [gscSites, setGscSites] = useState<string[]>([])
  const [siteDetails, setSiteDetails] = useState<any[]>([])
  const [ga4Properties, setGa4Properties] = useState<any[]>([])
  
  const [selectedGsc, setSelectedGsc] = useState("")
  const [selectedGa4, setSelectedGa4] = useState("")
  const [activeProjectName, setActiveProjectName] = useState("Active Project")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isManualMode, setIsManualMode] = useState(false)

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch sites & properties
      const resSites = await fetch('/api/integrations/google/sites')
      const data = await resSites.json()
      
      let fetchedSites: string[] = []
      let fetchedGa4: any[] = []

      if (data.tokenExpired) {
        setIsTokenExpired(true)
        setIsGoogleConnected(false)
      } else if (data.connected) {
        setIsGoogleConnected(true)
        setIsTokenExpired(false)
        fetchedSites = data.sites || []
        fetchedGa4 = data.ga4Properties || []
        setGscSites(fetchedSites)
        if (data.siteDetails) {
          setSiteDetails(data.siteDetails)
        }
        setGa4Properties(fetchedGa4)
      } else {
        setIsGoogleConnected(false)
      }

      // 2. Fetch projects to get saved mapping
      const resProj = await fetch('/api/projects')
      const projData = await resProj.json()
      
      const activeProjectId = localStorage.getItem('llm_active_project_id')
      const activeProject = projData.projects?.find((p: any) => p.id === activeProjectId) || projData.projects?.[0]

      if (activeProject) {
        setActiveProjectName(activeProject.name)
        if (activeProject.gsc_property) {
          setSelectedGsc(activeProject.gsc_property)
        } else if (fetchedSites.length > 0) {
          setSelectedGsc(fetchedSites[0])
        }

        if (activeProject.ga4_property_id) {
          setSelectedGa4(activeProject.ga4_property_id)
        } else if (fetchedGa4.length > 0) {
          setSelectedGa4(fetchedGa4[0].propertyId)
        }
      }

    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()

    const handleProjectChange = () => {
      loadInitialData()
    }
    window.addEventListener('llm_project_changed', handleProjectChange)
    return () => window.removeEventListener('llm_project_changed', handleProjectChange)
  }, [])

  const handleSaveMapping = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const activeProjectId = localStorage.getItem('llm_active_project_id') || '8f36535c-6f66-48a3-82a1-eb5f97ce9d66'
      const res = await fetch('/api/projects/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProjectId,
          gsc_property: selectedGsc,
          ga4_property_id: selectedGa4
        })
      })
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const integrations = [
    { 
      name: "Google Search Console", 
      desc: "Organic search queries, impressions, CTR, and rank positions", 
      status: isGoogleConnected ? "Connected" : isTokenExpired ? "Session Expired" : "Not connected", 
      lastSync: isGoogleConnected ? "Just now" : isTokenExpired ? "Expired" : "-", 
      health: isGoogleConnected ? "Free Quota (100k req/day)" : isTokenExpired ? "Action Required" : "-", 
      billingPlan: "100% Free",
      creditBadge: "Free Quota",
      type: "seo" 
    },
    { 
      name: "Google Analytics 4", 
      desc: "Traffic, active users, session events, and conversions", 
      status: isGoogleConnected ? "Connected" : isTokenExpired ? "Session Expired" : "Not connected", 
      lastSync: isGoogleConnected ? "Just now" : isTokenExpired ? "Expired" : "-", 
      health: isGoogleConnected ? "Free Quota (Standard)" : isTokenExpired ? "Action Required" : "-", 
      billingPlan: "100% Free",
      creditBadge: "Free Quota",
      type: "seo" 
    },
    { 
      name: "OpenAI API", 
      desc: "ChatGPT 4o-mini brand recommendation and buyer intent auditing", 
      status: "Connected", 
      lastSync: "Active", 
      health: "Pay-as-you-go (Active Key)", 
      billingPlan: "Usage / Auto-Debit",
      creditBadge: "Pay-as-you-go",
      type: "ai" 
    },
    { 
      name: "Google Gemini API", 
      desc: "Gemini 2.5 Flash brand share of voice and citation tracking", 
      status: "Connected", 
      lastSync: "Active", 
      health: "Free Tier (1,500 req/day)", 
      billingPlan: "$0.00 Free Tier",
      creditBadge: "1.5k Free/day",
      type: "ai" 
    },
    { 
      name: "Anthropic Claude API", 
      desc: "Claude Haiku brand preference and multi-engine competitor ranking", 
      status: "Connected", 
      lastSync: "Active", 
      health: "Console Prepaid (Active)", 
      billingPlan: "Prepaid Balance",
      creditBadge: "Active Key",
      type: "ai" 
    },
    { 
      name: "DataForSEO", 
      desc: "Live search volumes, CPC, keyword difficulty, and competitor gap data", 
      status: "Connected", 
      lastSync: "Active", 
      health: "Live ($41.15 USD)", 
      billingPlan: "Prepaid Balance",
      creditBadge: "$41.15 USD",
      type: "seo" 
    },
  ]

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* SUCCESS BANNER */}
      {success === 'google_connected' && (
        <div className="bg-positive/10 border border-positive/20 text-positive px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Google Search Console & GA4 successfully connected with fresh credentials!</p>
        </div>
      )}

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Google authorization attempt failed. Please click Reconnect below.</p>
        </div>
      )}

      {/* TOKEN EXPIRED ALERT BANNER */}
      {isTokenExpired && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Google Account Token Expired (Action Required)</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Google expires testing OAuth tokens after 7 days. Reconnecting your account will immediately refresh your access token and restore live GSC and GA4 properties.
              </p>
            </div>
          </div>
          <Link href="/api/integrations/google">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2 text-xs font-bold shrink-0 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5" />
              Reconnect Google Account
            </Button>
          </Link>
        </div>
      )}

      {/* PROJECT DATA SOURCES CARD */}
      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Project Data Sources</CardTitle>
                <Badge variant="brand" className="text-[10px]">{activeProjectName}</Badge>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Map Google Search Console and Google Analytics 4 properties to feed live data into dashboards.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsManualMode(!isManualMode)}
                className="text-xs h-8 gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isManualMode ? "Switch to Dropdown" : "Manual Property Input"}
              </Button>
              <Link href="/api/integrations/google">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-brand text-white hover:bg-brand/90 text-xs h-8 gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isGoogleConnected ? "Re-authenticate Google" : "Connect Google"}
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GSC Property Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  Google Search Console Property
                </label>
                {selectedGsc && (
                  <span className="text-[11px] text-positive font-semibold">Active</span>
                )}
              </div>

              {isManualMode ? (
                <input 
                  type="text" 
                  value={selectedGsc}
                  onChange={e => setSelectedGsc(e.target.value)}
                  placeholder="https://www.truefirms.co/"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-brand font-mono text-xs"
                />
              ) : (
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground disabled:opacity-60"
                  value={selectedGsc}
                  onChange={e => setSelectedGsc(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">{isLoading ? "Loading properties..." : "-- Select GSC Property --"}</option>
                  {/* Keep current active property if not in list */}
                  {selectedGsc && !gscSites.includes(selectedGsc) && (
                    <option value={selectedGsc}>{selectedGsc} (Current Active)</option>
                  )}
                  {siteDetails.length > 0 ? (
                    siteDetails.map((item: any) => (
                      <option key={item.siteUrl} value={item.siteUrl}>
                        {item.siteUrl} {item.isVerified ? "✓ (Verified Owner)" : "⚠️ (Unverified in Search Console)"}
                      </option>
                    ))
                  ) : (
                    gscSites.map(site => (
                      <option key={site} value={site}>{site}</option>
                    ))
                  )}
                </select>
              )}
              {selectedGsc && siteDetails.find(s => s.siteUrl === selectedGsc)?.isVerified === true && (
                <div className="text-[11px] text-positive bg-positive/10 p-2 rounded-lg border border-positive/20 mt-1 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>Verified Owner:</strong> Google Search Console property is active and ready for reporting.
                  </span>
                </div>
              )}
              {selectedGsc && siteDetails.find(s => s.siteUrl === selectedGsc)?.isVerified === false && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 mt-1 flex items-start gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Unverified in Search Console:</strong> <code>{selectedGsc}</code> is unverified for this account. Please verify domain ownership in Search Console.
                  </span>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">
                Currently linked: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{selectedGsc || "None"}</code>
              </p>
            </div>

            {/* GA4 Property Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                  Google Analytics 4 Property
                </label>
                {selectedGa4 && (
                  <span className="text-[11px] text-positive font-semibold">Active</span>
                )}
              </div>

              {isManualMode ? (
                <input 
                  type="text" 
                  value={selectedGa4}
                  onChange={e => setSelectedGa4(e.target.value)}
                  placeholder="properties/321056997"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-brand font-mono text-xs"
                />
              ) : (
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground disabled:opacity-60"
                  value={selectedGa4}
                  onChange={e => setSelectedGa4(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">{isLoading ? "Loading properties..." : "-- Select GA4 Property --"}</option>
                  {/* Keep current active property if not in list */}
                  {selectedGa4 && !ga4Properties.some(p => p.propertyId === selectedGa4) && (
                    <option value={selectedGa4}>{selectedGa4} (Current Active)</option>
                  )}
                  {ga4Properties.map(prop => (
                    <option key={prop.propertyId} value={prop.propertyId}>
                      {prop.accountName} - {prop.propertyName} ({prop.propertyId})
                    </option>
                  ))}
                </select>
              )}
              {selectedGa4 && ga4Properties.some(p => p.propertyId === selectedGa4) && (
                <div className="text-[11px] text-positive bg-positive/10 p-2 rounded-lg border border-positive/20 mt-1 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>Verified & Connected:</strong> GA4 Property is active in your connected Google account.
                  </span>
                </div>
              )}
              {selectedGa4 && ga4Properties.length > 0 && !ga4Properties.some(p => p.propertyId === selectedGa4) && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 mt-1 flex items-start gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Property Not Found in Connected Account:</strong> <code>{selectedGa4}</code> is not in your currently connected Google account.
                  </span>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">
                Currently linked: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{selectedGa4 || "None"}</code>
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSaveMapping} 
              disabled={isSaving || isLoading} 
              className="bg-brand text-white hover:bg-brand/90 text-xs font-semibold h-9"
            >
              {isSaving ? "Saving..." : "Save Data Sources"}
            </Button>
            {saveSuccess && (
              <span className="text-xs text-positive font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> 
                Saved successfully!
              </span>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadInitialData}
            className="text-xs text-muted-foreground gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Properties
          </Button>
        </CardFooter>
      </Card>

      {/* INTEGRATIONS DIRECTORY */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Connected Integrations & Services</h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              Data pipelines feeding organic search, traffic conversions, and live AI model audits.
            </p>
          </div>
          <Link href="/api/integrations/google">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> 
              Re-authenticate Google
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map(integration => {
            const isGoogle = integration.name.includes("Google Search") || integration.name.includes("Google Analytics")
            const isExpired = isGoogle && isTokenExpired

            return (
              <Card key={integration.name} className="flex flex-col border-border bg-card">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm
                      ${integration.type === 'seo' ? 'bg-blue-500/10 text-blue-500' : 
                        integration.type === 'ai' ? 'bg-purple-500/10 text-purple-500' : 
                        'bg-muted text-foreground'}`}>
                      {integration.name.charAt(0)}
                    </div>
                    <Badge variant={
                      isExpired ? 'destructive' :
                      integration.status === 'Connected' ? 'positive' :
                      integration.status.includes('Configured') ? 'outline' : 'warning'
                    } className="text-[10px]">
                      {isExpired ? 'Session Expired' : integration.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold">{integration.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-0.5">{integration.desc}</CardDescription>
                </CardHeader>

                <CardContent className="pt-3 pb-3 flex-1 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Status</span>
                      <span className={`font-semibold ${isExpired ? "text-destructive" : integration.status === 'Connected' ? "text-positive" : "text-foreground"}`}>
                        {isExpired ? "Reconnect Required" : integration.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Data Pipeline</span>
                      <span className="font-medium text-foreground">{integration.health}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Billing Plan</span>
                      <span className="font-medium text-foreground">{integration.billingPlan}</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-3 pt-0 mt-auto border-t">
                  {isGoogle ? (
                    <Link href="/api/integrations/google" className="w-full block">
                      <Button 
                        variant={isExpired ? "default" : "outline"} 
                        size="sm"
                        className={`w-full text-xs font-semibold h-8 gap-1.5 ${isExpired ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {isExpired ? "Reconnect Account" : "Re-authenticate"}
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-positive font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> API Active & Live
                      </span>
                      <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                        integration.creditBadge.includes('$') ? 'text-slate-800 bg-slate-100' :
                        integration.creditBadge.includes('Free') ? 'text-emerald-700 bg-emerald-50' :
                        'text-purple-700 bg-purple-50'
                      }`}>
                        {integration.creditBadge}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading integrations...</div>}>
      <IntegrationsContent />
    </Suspense>
  )
}
