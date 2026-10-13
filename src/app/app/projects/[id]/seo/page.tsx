"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function SEOIntelligencePage() {
  const trafficData = [
    { name: 'Mon', brand: 4000, nonBrand: 2400 },
    { name: 'Tue', brand: 3000, nonBrand: 1398 },
    { name: 'Wed', brand: 2000, nonBrand: 9800 },
    { name: 'Thu', brand: 2780, nonBrand: 3908 },
    { name: 'Fri', brand: 1890, nonBrand: 4800 },
    { name: 'Sat', brand: 2390, nonBrand: 3800 },
    { name: 'Sun', brand: 3490, nonBrand: 4300 },
  ]

  const keywords = [
    { kw: "enterprise seo platform", intent: "Commercial", pos: 3, change: "+2", vol: "4.2K", opp: "High" },
    { kw: "what is ai visibility", intent: "Informational", pos: 1, change: "-", vol: "1.8K", opp: "Medium" },
    { crossed: true, kw: "cheap rank tracker", intent: "Transactional", pos: 14, change: "-4", vol: "8.1K", opp: "Low" },
    { kw: "llm optimization software", intent: "Commercial", pos: 5, change: "+12", vol: "2.1K", opp: "High" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">SEO Intelligence</h1>
        <p className="text-muted-foreground mt-1">
          Organic performance, keyword opportunities, and search console insights.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          Source: Google Search Console
        </Badge>
        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
          Source: Google Analytics 4
        </Badge>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Organic Clicks", val: "42.8K", source: "GSC" },
          { label: "Impressions", val: "1.2M", source: "GSC" },
          { label: "Avg CTR", val: "3.4%", source: "GSC" },
          { label: "Avg Position", val: "14.2", source: "GSC" },
          { label: "Sessions", val: "38.5K", source: "GA4" },
          { label: "Conversions", val: "842", source: "GA4" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 relative">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</p>
              <div className="text-xl font-bold">{kpi.val}</div>
              <Badge variant="secondary" className="absolute top-3 right-3 text-[10px] px-1 py-0 h-4">
                {kpi.source}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Brand vs Non-Brand Traffic</CardTitle>
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-xs">GA4</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="brand" stackId="a" fill="hsl(var(--brand))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="nonBrand" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Top Keyword Opportunities</CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">GSC</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Keyword</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Opportunity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="font-medium text-foreground">{kw.kw}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{kw.intent}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{kw.pos}</div>
                      <div className={`text-xs ${kw.change.startsWith('+') ? 'text-positive' : kw.change.startsWith('-') && kw.change !== '-' ? 'text-negative' : 'text-muted-foreground'}`}>
                        {kw.change}
                      </div>
                    </TableCell>
                    <TableCell>{kw.vol}</TableCell>
                    <TableCell>
                      <Badge variant={kw.opp === 'High' ? 'positive' : kw.opp === 'Medium' ? 'warning' : 'outline'}>{kw.opp}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
