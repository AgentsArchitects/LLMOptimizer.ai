"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing & Usage</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription plan, prompt checks, and invoices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Plan */}
        <Card className="col-span-1 border-brand/30 shadow-[0_0_20px_rgba(53,224,255,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge variant="brand">Active</Badge>
          </div>
          <CardHeader>
            <CardTitle>Growth Plan</CardTitle>
            <div className="mt-4 flex items-baseline text-4xl font-bold tracking-tight">
              $199
              <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand"></div> 5 Workspaces
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand"></div> 20,000 Prompt Checks
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand"></div> Agentic Action Queue
              </li>
            </ul>
            <div className="pt-4 border-t flex gap-3">
              <Button variant="default" className="flex-1">Upgrade</Button>
              <Button variant="outline" className="flex-1">Manage</Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Meter */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Prompt Checks Usage</CardTitle>
            <CardDescription>
              1 Prompt × 1 AI Engine × 1 Market × 1 Run = 1 Prompt Check
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">12,480 used</span>
                  <span className="text-muted-foreground">20,000 limit</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand to-purple-500 rounded-full" style={{ width: '62%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">Resets in 12 days</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">ChatGPT</p>
                  <p className="text-lg font-bold mt-1">4,200</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Gemini</p>
                  <p className="text-lg font-bold mt-1">3,150</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Perplexity</p>
                  <p className="text-lg font-bold mt-1">3,800</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Claude</p>
                  <p className="text-lg font-bold mt-1">1,330</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
