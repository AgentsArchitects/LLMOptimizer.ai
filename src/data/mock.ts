export const mockOverviewData = {
  user: {
    name: "Shubham",
    organization: "Truefirms",
  },
  kpis: {
    aiVisibility: { value: 72.4, change: 8.7 },
    aiShareOfVoice: { value: 31.8, change: 4.2 },
    organicTraffic: { value: 128400, change: 12.6 },
    dataHealth: 94,
    promptChecksUsed: 12480,
    promptChecksLimit: 20000,
    actionsPending: 7,
  },
  trendData: [
    { date: "Sep 1", ai: 64, organic: 60, competitor: 70 },
    { date: "Sep 5", ai: 65, organic: 61, competitor: 68 },
    { date: "Sep 10", ai: 68, organic: 62, competitor: 65 },
    { date: "Sep 15", ai: 67, organic: 65, competitor: 66 },
    { date: "Sep 20", ai: 70, organic: 68, competitor: 64 },
    { date: "Sep 25", ai: 72, organic: 71, competitor: 62 },
    { date: "Sep 30", ai: 72.4, organic: 74, competitor: 60 },
  ],
  insights: [
    {
      title: "AI visibility increased 8.7% for 'Staff Augmentation'",
      contributors: [
        "14 new citations across authoritative AI directories",
        "ChatGPT-4o included Truefirms in 'Top IT Staffing Platforms'",
        "3 refreshed service pages indexed by Perplexity"
      ],
      confidence: "High",
    }
  ],
  actions: [
    {
      id: "a1",
      title: "Improve comparison-page coverage for 'Hire Dedicated Developers'",
      evidence: "7 of 18 comparison prompts mention Toptal/Upwork but not Truefirms.",
      impact: "Organic traffic + AI citation coverage",
      confidence: "High",
      effort: "M",
      ice: 8.4,
      owner: "SEO Team",
      status: "Awaiting approval"
    },
    {
      id: "a2",
      title: "Add Organization schema to primary author pages",
      evidence: "23 pages contain missing or malformed entity schema.",
      impact: "Knowledge graph confidence",
      confidence: "High",
      effort: "S",
      ice: 7.9,
      owner: "Dev Team",
      status: "Proposed"
    },
    {
      id: "a3",
      title: "Refresh decaying content on 'Benefits of Staff Augmentation'",
      evidence: "Organic traffic down 14% MoM; Perplexity citations lost to Competitor A.",
      impact: "Recapture lost Share of Voice",
      confidence: "Medium",
      effort: "L",
      ice: 6.8,
      owner: "Content Team",
      status: "In Progress"
    }
  ]
}
