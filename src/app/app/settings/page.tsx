"use client"
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  Key, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  Bot, 
  Check, 
  Palette
} from "lucide-react"

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("Agency Architects HQ")
  const [defaultCurrency, setDefaultCurrency] = useState("USD ($)")
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [decayAlerts, setDecayAlerts] = useState(true)
  const [competitorAlerts, setCompetitorAlerts] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setToastMessage("Settings saved successfully!")
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
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Settings</h1>
          <Badge variant="brand" className="text-[11px] font-medium">
            Agency Configuration
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Configure branding, connected AI engine credentials, notification alerts, and deliverable preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Profile */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base">Workspace Identity</CardTitle>
            <CardDescription className="text-xs">
              This name and branding will appear on exported client PDF reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Workspace / Agency Name
                </label>
                <input 
                  type="text" 
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Reporting Currency
                </label>
                <select 
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="INR (₹)">INR (₹)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Engine Status */}
        <Card className="border border-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">Frontier AI Engine Connections</CardTitle>
                <CardDescription className="text-xs">
                  Connected model APIs powering real-time brand recommendation audits.
                </CardDescription>
              </div>
              <Badge variant="positive" className="text-xs gap-1">
                <Check className="w-3.5 h-3.5" />
                3 Models Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                  GPT
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">OpenAI API (ChatGPT)</div>
                  <div className="text-xs text-muted-foreground font-mono">sk-proj-LbSD... (Active & Verified)</div>
                </div>
              </div>
              <Badge variant="positive" className="text-xs">Connected</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-500/10 text-blue-500 font-bold text-xs">
                  GEM
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Google Gemini API</div>
                  <div className="text-xs text-muted-foreground font-mono">AIzaSyDh... (Active & Verified)</div>
                </div>
              </div>
              <Badge variant="positive" className="text-xs">Connected</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-amber-500/10 text-amber-500 font-bold text-xs">
                  ANT
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Anthropic Claude API</div>
                  <div className="text-xs text-muted-foreground font-mono">sk-ant-api03... (Active & Verified)</div>
                </div>
              </div>
              <Badge variant="positive" className="text-xs">Connected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Automated Intelligence Notifications */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base">Automated Alert Triggers</CardTitle>
            <CardDescription className="text-xs">
              Receive instant updates when AI visibility drops or new citation gaps emerge.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between p-2 rounded hover:bg-muted/30 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-foreground block">Weekly Automated Deliverables</span>
                <span className="text-xs text-muted-foreground">Send weekly executive summaries every Monday morning.</span>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border text-brand focus:ring-brand cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded hover:bg-muted/30 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-foreground block">Content Decay & Citation Loss Alerts</span>
                <span className="text-xs text-muted-foreground">Notify when a competitor steals an AI recommendation slot.</span>
              </div>
              <input 
                type="checkbox" 
                checked={decayAlerts}
                onChange={(e) => setDecayAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border text-brand focus:ring-brand cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded hover:bg-muted/30 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-foreground block">Action Item Approvals</span>
                <span className="text-xs text-muted-foreground">Alert when high-ICE actions are approved for execution.</span>
              </div>
              <input 
                type="checkbox" 
                checked={competitorAlerts}
                onChange={(e) => setCompetitorAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border text-brand focus:ring-brand cursor-pointer"
              />
            </label>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" className="gap-2 bg-brand hover:bg-brand/90 text-white">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
