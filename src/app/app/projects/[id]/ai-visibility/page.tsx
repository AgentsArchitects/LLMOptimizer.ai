"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Sparkles, TrendingUp, TrendingDown } from "lucide-react"

export default function AIVisibilityPage() {
  const mockPrompts = [
    { id: 1, text: "Best enterprise SEO software 2026", engine: "ChatGPT", mention: true, pos: 2, compMention: true, citation: true, trend: "up" },
    { id: 2, text: "How to track AI share of voice", engine: "Perplexity", mention: true, pos: 1, compMention: false, citation: true, trend: "up" },
    { id: 3, text: "Compare Acme Corp vs Competitor A", engine: "Gemini", mention: true, pos: 1, compMention: true, citation: false, trend: "flat" },
    { id: 4, text: "Top data analytics tools for marketing", engine: "ChatGPT", mention: false, pos: "-", compMention: true, citation: false, trend: "down" },
    { id: 5, text: "Automated SEO reporting software", engine: "Claude", mention: true, pos: 3, compMention: true, citation: true, trend: "up" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand" /> AI Visibility
        </h1>
        <p className="text-muted-foreground mt-1">
          Understand how AI engines describe and recommend your brand.
        </p>
      </div>

      {/* Top Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-xl border">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search prompts..." className="w-full bg-background border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2"/> Market: US</Button>
          <Button variant="outline" size="sm">AI Engine: All</Button>
          <Button variant="outline" size="sm">Intent: All</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "AI Visibility", val: "72.4%", change: "+8.7%" },
          { label: "Share of Voice", val: "31.8%", change: "+4.2%" },
          { label: "Citation Share", val: "44.2%", change: "+12.1%" },
          { label: "Avg Mention Position", val: "2.4", change: "+0.3" },
          { label: "Prompt Win Rate", val: "68%", change: "-2.1%" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</p>
              <div className="text-2xl font-bold">{kpi.val}</div>
              <div className={`text-xs mt-2 font-medium ${kpi.change.startsWith('+') ? 'text-positive' : 'text-negative'}`}>
                {kpi.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prompt Performance</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Your brand's visibility across tracked buyer questions.</p>
          </div>
          <Button variant="default">Add Prompts</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Prompt</TableHead>
                <TableHead>Engine</TableHead>
                <TableHead>Brand Mention</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Competitor</TableHead>
                <TableHead>Citation</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPrompts.map(p => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{p.text}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.engine}</Badge>
                  </TableCell>
                  <TableCell>
                    {p.mention ? (
                      <Badge variant="positive">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{p.pos}</TableCell>
                  <TableCell>
                    {p.compMention ? (
                      <span className="text-warning text-sm font-medium">Present</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.citation ? <Badge variant="brand">Cited</Badge> : <span className="text-muted-foreground text-sm">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-positive inline" />
                    ) : p.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-negative inline" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
