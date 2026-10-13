"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./landing.css";

export default function MarketingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const toggleFaq = (e: React.MouseEvent<HTMLButtonElement>) => {
    const item = e.currentTarget.parentElement;
    if (item) {
      item.classList.toggle("open");
      const span = e.currentTarget.querySelector("span");
      if (span) {
        span.textContent = item.classList.contains("open") ? "−" : "+";
      }
    }
  };

  return (
    <div className="landing-body">
      <nav className="landing-nav">
        <div className="landing-container nav-inner">
          <Link href="#" className="brand">
            <span className="brand-mark"></span>
            <span>LLMOptimizer.ai</span>
          </Link>
          <div className="nav-links">
            <Link href="#platform">Platform</Link>
            <Link href="#ai-visibility">AI Visibility</Link>
            <Link href="#agency">For Agencies</Link>
            <Link href="#security">Security</Link>
            <Link href="#pricing">Pricing</Link>
          </div>
          <div className="nav-cta">
            <Link className="landing-btn landing-btn-secondary" href="/app">
              Sign in
            </Link>
            <Link className="landing-btn landing-btn-primary" href="/app">
              Start free audit
            </Link>
            <button className="hamburger" aria-label="Menu">
              ☰
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="landing-container hero-grid">
            <div>
              <span className="eyebrow">
                <span className="dot"></span> AI Search Intelligence for the Answer Era
              </span>
              <h1 className="gradient-text">Know how your brand performs across search — and AI.</h1>
              <p>
                LLMOptimizer.ai unifies SEO, AEO and GEO intelligence into one agentic platform. Monitor traditional search, track AI citations, diagnose performance changes, and turn every signal into a prioritized action.
              </p>
              <div className="hero-actions">
                <Link className="landing-btn landing-btn-primary" href="/app">
                  Run your free visibility audit
                </Link>
                <Link className="landing-btn landing-btn-secondary" href="#platform">
                  Explore the platform →
                </Link>
              </div>
              <div className="hero-meta">
                <span><strong>Multi-engine</strong> AI visibility</span>
                <span><strong>Agentic</strong> recommendations</span>
                <span><strong>Agency-ready</strong> reporting</span>
              </div>
            </div>

            <div className="visual-shell">
              <div className="mock-app">
                <div className="app-top">
                  <div className="traffic">
                    <i></i><i></i><i></i>
                  </div>
                  <div style={{ fontSize: "9px", color: "#70819d" }}>workspace / acme-corp / overview</div>
                </div>
                <div className="app-body">
                  <aside className="sidebar-mock">
                    <div className="side-label">Intelligence</div>
                    <div className="side-item active">Executive Overview</div>
                    <div className="side-item">AI Visibility</div>
                    <div className="side-item">Rankings</div>
                    <div className="side-item">Content</div>
                    <div className="side-item">Backlinks</div>
                    <div className="side-item">Technical Health</div>
                    <div className="side-label">Agents</div>
                    <div className="side-item">Action Queue</div>
                    <div className="side-item">Reports</div>
                  </aside>
                  <div className="dashboard-mock">
                    <div className="dash-head">
                      <div>
                        <div className="dash-title">Executive Intelligence</div>
                        <div className="dash-sub">SEO + AEO + GEO • Last 30 days</div>
                      </div>
                      <div className="pill">● Data healthy</div>
                    </div>
                    <div className="kpis">
                      <div className="kpi">
                        <small>AI Share of Voice</small>
                        <b>28.4%</b>
                        <span className="up">↑ 6.2%</span>
                      </div>
                      <div className="kpi">
                        <small>Organic Visibility</small>
                        <b>74.9</b>
                        <span className="up">↑ 4.8%</span>
                      </div>
                      <div className="kpi">
                        <small>Data Health</small>
                        <b>96/100</b>
                        <span className="up">Verified</span>
                      </div>
                    </div>
                    <div className="chart-mock">
                      <svg viewBox="0 0 600 130" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0" stopColor="#35e0ff" />
                            <stop offset="1" stopColor="#8f5cff" />
                          </linearGradient>
                        </defs>
                        <path d="M5,105 C70,100 75,70 130,76 C190,84 205,45 260,55 C320,65 340,30 400,42 C450,52 490,18 595,24" fill="none" stroke="url(#g)" strokeWidth="4" />
                      </svg>
                    </div>
                    <div className="mini-grid">
                      <div className="mini">
                        <div style={{ fontSize: "11px", fontWeight: 800, marginBottom: "7px" }}>AI Engine Coverage</div>
                        <div className="engine-row">
                          <span>ChatGPT</span>
                          <div className="bar">
                            <div className="fill" style={{ width: "78%" }}></div>
                          </div>
                          <b>78</b>
                        </div>
                        <div className="engine-row">
                          <span>Gemini</span>
                          <div className="bar">
                            <div className="fill" style={{ width: "62%" }}></div>
                          </div>
                          <b>62</b>
                        </div>
                        <div className="engine-row">
                          <span>Perplexity</span>
                          <div className="bar">
                            <div className="fill" style={{ width: "71%" }}></div>
                          </div>
                          <b>71</b>
                        </div>
                      </div>
                      <div className="mini">
                        <div style={{ fontSize: "11px", fontWeight: 800, marginBottom: "8px" }}>Agent Priority</div>
                        <div style={{ fontSize: "10px", color: "#9db0c5", marginBottom: "7px" }}>
                          Improve 6 high-impression pages with low AI citation coverage.
                        </div>
                        <span className="landing-tag">ICE 92</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="landing-container logos">
          <div className="logo-title">Connect the stack you already use</div>
          <div className="logo-row">
            <div className="logo-item">Google Analytics</div>
            <div className="logo-item">Search Console</div>
            <div className="logo-item">SEMrush</div>
            <div className="logo-item">DataForSEO</div>
            <div className="logo-item">OpenAI</div>
            <div className="logo-item">Gumshoe</div>
          </div>
        </div>

        <section id="platform" className="landing-section">
          <div className="landing-container">
            <div className="section-head">
              <span className="eyebrow">One intelligence layer</span>
              <h2 className="gradient-text">From fragmented reports to a decision system.</h2>
              <p>
                LLMOptimizer.ai brings search performance, AI answer visibility, technical health, content intelligence and agentic recommendations into one governed workspace.
              </p>
            </div>
            <div className="cards">
              <article className="landing-card">
                <div className="landing-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
                  </svg>
                </div>
                <h3>Executive Intelligence</h3>
                <p>One client-ready view of traffic, rankings, conversions, backlinks, AI visibility and prioritized actions.</p>
              </article>
              <article className="landing-card">
                <div className="landing-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 5h16v14H4z" />
                    <path d="M8 9h8M8 13h5" />
                  </svg>
                </div>
                <h3>Weekly & Monthly Reports</h3>
                <p>Generate tactical weekly reports and strategic monthly reports automatically, with analyst approval before delivery.</p>
              </article>
              <article className="landing-card">
                <div className="landing-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3v18M3 12h18" />
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                </div>
                <h3>AI Search Visibility</h3>
                <p>Track mentions, citations, share of voice and competitive positioning across major answer engines.</p>
              </article>
              <article className="landing-card">
                <div className="landing-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 18 9 13l4 4 7-9" />
                    <path d="M17 8h3v3" />
                  </svg>
                </div>
                <h3>Root-Cause Analysis</h3>
                <p>Move beyond “traffic dropped.” Diagnose why it happened using cross-source evidence and confidence-ranked hypotheses.</p>
              </article>
              <article className="landing-card">
                <div className="landing-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5v14" />
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                  </svg>
                </div>
                <h3>Agentic Action Queue</h3>
                <p>Prioritize opportunities with impact, confidence and effort scores — then approve, deploy and measure outcomes.</p>
              </article>
              <article className="landing-card">
                <div className="landing-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 17l4-4 4 2 6-8 2 2" />
                    <path d="M4 4v16h16" />
                  </svg>
                </div>
                <h3>Forecasting & Scenarios</h3>
                <p>Model baseline outcomes and action-adjusted scenarios so teams can understand where performance is headed next.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section band" id="agency">
          <div className="landing-container">
            <div className="section-head">
              <span className="eyebrow">Built for scale</span>
              <h2 className="gradient-text">One operating system for every client account.</h2>
              <p>
                Agency workspaces isolate tenants, standardize reporting quality and make the best thinking of senior analysts repeatable across every account.
              </p>
            </div>
            <div className="workflow">
              <div className="step">
                <div className="step-num">01</div>
                <h4>Connect</h4>
                <p>GA4, GSC, SEMrush, DataForSEO, Gumshoe and more.</p>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <h4>Normalize</h4>
                <p>Clean, reconcile and validate every client dataset.</p>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <h4>Reason</h4>
                <p>Specialist agents analyze SEO, AEO, content and anomalies.</p>
              </div>
              <div className="step">
                <div className="step-num">04</div>
                <h4>Approve</h4>
                <p>Human-in-the-loop review for every recommendation and report.</p>
              </div>
              <div className="step">
                <div className="step-num">05</div>
                <h4>Deliver</h4>
                <p>Branded dashboards, PDFs, portals and scheduled reporting.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="ai-visibility" className="landing-section">
          <div className="landing-container">
            <div className="section-head">
              <span className="eyebrow">AEO / GEO Intelligence</span>
              <h2 className="gradient-text">See where AI recommends you — and where it doesn’t.</h2>
              <p>
                Measure prompt coverage, citation share, answer position, competitor inclusion and source preference across tracked AI experiences.
              </p>
            </div>
            <div className="aeo-grid">
              <div className="score-panel">
                <div style={{ fontSize: "13px", color: "#8195af", textTransform: "uppercase", letterSpacing: ".12em" }}>
                  AI Visibility Score
                </div>
                <div className="score-ring">
                  <div>
                    <b>68</b>
                    <span>/100</span>
                  </div>
                </div>
                <div className="model-list">
                  <div className="model">
                    <span>ChatGPT</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "74%" }}></div>
                    </div>
                    <b>74</b>
                  </div>
                  <div className="model">
                    <span>Gemini</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "61%" }}></div>
                    </div>
                    <b>61</b>
                  </div>
                  <div className="model">
                    <span>Perplexity</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "78%" }}></div>
                    </div>
                    <b>78</b>
                  </div>
                  <div className="model">
                    <span>Copilot</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "58%" }}></div>
                    </div>
                    <b>58</b>
                  </div>
                </div>
              </div>
              <div className="insight-panel">
                <div className="insight">
                  <span className="landing-tag">GAIN</span>
                  <div>
                    <b>7 prompts gained brand visibility this week</b>
                    <p>Most gains came from commercial-intent prompts around enterprise AI implementation.</p>
                  </div>
                </div>
                <div className="insight">
                  <span className="landing-tag" style={{ background: "#ffcb6b" }}>GAP</span>
                  <div>
                    <b>Competitor dominates 11 high-value prompts</b>
                    <p>Three competitor domains are cited repeatedly where your domain is absent.</p>
                  </div>
                </div>
                <div className="insight">
                  <span className="landing-tag" style={{ background: "#a889ff" }}>SOURCE</span>
                  <div>
                    <b>AI engines prefer 4 external sources over your own site</b>
                    <p>LLMOptimizer identifies the pages and citation patterns creating that authority gap.</p>
                  </div>
                </div>
                <div className="insight">
                  <span className="landing-tag" style={{ background: "#40e69b" }}>ACTION</span>
                  <div>
                    <b>12 recommended content and schema improvements</b>
                    <p>Prioritized by expected influence, confidence and implementation effort.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section band" id="security">
          <div className="landing-container">
            <div className="section-head">
              <span className="eyebrow">Enterprise foundation</span>
              <h2 className="gradient-text">Governed, isolated and auditable by design.</h2>
              <p>Enterprise controls are part of the product architecture — not an afterthought added after scale.</p>
            </div>
            <div className="security-grid">
              <div className="security">
                <strong>Tenant Isolation</strong>
                <span>Logical client separation with scoped data access and per-tenant controls.</span>
              </div>
              <div className="security">
                <strong>RBAC & SSO</strong>
                <span>Admin, analyst and viewer roles with enterprise authentication support.</span>
              </div>
              <div className="security">
                <strong>Auditability</strong>
                <span>Trace every metric, agent run, recommendation, approval and export.</span>
              </div>
              <div className="security">
                <strong>Secrets Management</strong>
                <span>API credentials encrypted and isolated from application code.</span>
              </div>
              <div className="security">
                <strong>Human Approval</strong>
                <span>No client-facing recommendation or mutation occurs invisibly.</span>
              </div>
              <div className="security">
                <strong>Data Provenance</strong>
                <span>Every claim maps back to its source, timestamp and processing path.</span>
              </div>
              <div className="security">
                <strong>Usage Metering</strong>
                <span>Track AI, connector and report usage by account and plan entitlement.</span>
              </div>
              <div className="security">
                <strong>Agency White Label</strong>
                <span>Brand-controlled client portals, exports and report templates.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="landing-section">
          <div className="landing-container">
            <div className="section-head" style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
              <span className="eyebrow">Simple SaaS packaging</span>
              <h2 className="gradient-text">Start with visibility. Scale into intelligence.</h2>
              <p>Illustrative pricing architecture for product design. Final commercial pricing should be validated against unit economics before launch.</p>
            </div>
            <div className="pricing-toggle">
              <button
                className={`toggle-btn ${billingCycle === "monthly" ? "active" : ""}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`toggle-btn ${billingCycle === "annual" ? "active" : ""}`}
                onClick={() => setBillingCycle("annual")}
              >
                Annual · save 20%
              </button>
            </div>
            <div className="pricing">
              <div className="plan">
                <h3>Starter</h3>
                <div className="price">
                  {billingCycle === "monthly" ? "$99" : "$79"}
                  <small>/mo</small>
                </div>
                <p>For brands starting AI visibility and SEO intelligence monitoring.</p>
                <ul className="features">
                  <li>1 workspace</li>
                  <li>AI visibility tracking</li>
                  <li>SEO KPI dashboard</li>
                  <li>Monthly report</li>
                </ul>
                <Link className="landing-btn landing-btn-secondary" style={{ width: "100%" }} href="/app">
                  Start free audit
                </Link>
              </div>
              <div className="plan featured">
                <span className="landing-badge">MOST POPULAR</span>
                <h3>Growth</h3>
                <div className="price">
                  {billingCycle === "monthly" ? "$299" : "$239"}
                  <small>/mo</small>
                </div>
                <p>For growth teams that need continuous recommendations and reporting.</p>
                <ul className="features">
                  <li>5 workspaces</li>
                  <li>Agentic action queue</li>
                  <li>Weekly + monthly reports</li>
                  <li>Competitive AI share of voice</li>
                </ul>
                <Link className="landing-btn landing-btn-primary" style={{ width: "100%" }} href="/app">
                  Start Growth
                </Link>
              </div>
              <div className="plan">
                <h3>Agency</h3>
                <div className="price">
                  {billingCycle === "monthly" ? "$799" : "$639"}
                  <small>/mo</small>
                </div>
                <p>For agencies managing multiple client tenants from one control plane.</p>
                <ul className="features">
                  <li>25 client workspaces</li>
                  <li>White-label reports</li>
                  <li>Client portal</li>
                  <li>Pooled usage & team roles</li>
                </ul>
                <Link className="landing-btn landing-btn-secondary" style={{ width: "100%" }} href="/app">
                  Talk to sales
                </Link>
              </div>
              <div className="plan">
                <h3>Enterprise</h3>
                <div className="price">Custom</div>
                <p>For organizations requiring SSO, custom controls, higher limits and dedicated support.</p>
                <ul className="features">
                  <li>Custom tenancy</li>
                  <li>SSO / advanced RBAC</li>
                  <li>Custom connectors</li>
                  <li>Priority support & SLAs</li>
                </ul>
                <Link className="landing-btn landing-btn-secondary" style={{ width: "100%" }} href="/app">
                  Contact enterprise
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2 className="gradient-text">Built for teams that need answers, not more dashboards.</h2>
            </div>
            <div className="faq">
              <div className="faq-item open">
                <button className="faq-q" onClick={toggleFaq}>
                  Is LLMOptimizer.ai only an AI visibility tool?<span>−</span>
                </button>
                <div className="faq-a">
                  No. The platform combines traditional SEO intelligence, AEO/GEO visibility, technical health, content performance, anomaly diagnosis, recommendations and reporting in one system.
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-q" onClick={toggleFaq}>
                  Can agencies manage multiple clients?<span>+</span>
                </button>
                <div className="faq-a">
                  Yes. Agency accounts are designed around multi-client workspaces, pooled usage, internal analyst roles, branded reports and optional read-only client portals.
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-q" onClick={toggleFaq}>
                  Does it replace SEMrush, GA4 or DataForSEO?<span>+</span>
                </button>
                <div className="faq-a">
                  No. LLMOptimizer.ai is the intelligence and orchestration layer above your existing data sources. It turns disconnected tools into a unified decision system.
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-q" onClick={toggleFaq}>
                  Can AI recommendations publish changes automatically?<span>+</span>
                </button>
                <div className="faq-a">
                  The recommended default is human-in-the-loop. Teams review, approve or reject changes before deployment, with a complete audit trail.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="landing-container" id="cta">
          <div className="cta">
            <span className="eyebrow">Start with your visibility baseline</span>
            <h2 className="gradient-text">See how AI and search engines understand your brand.</h2>
            <p>
              Run a free visibility audit, discover your biggest SEO/AEO gaps, and see the prioritized actions LLMOptimizer.ai would recommend.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link className="landing-btn landing-btn-primary" href="/app">
                Run free audit
              </Link>
              <Link className="landing-btn landing-btn-secondary" href="/app">
                Book enterprise demo
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-grid">
            <div>
              <Link className="brand" href="#">
                <span className="brand-mark"></span>
                <span>LLMOptimizer.ai</span>
              </Link>
              <p style={{ fontSize: "12px", maxWidth: "320px", marginTop: "14px" }}>
                Agentic SEO, AEO and GEO intelligence for brands, agencies and enterprise teams operating in the AI answer era.
              </p>
            </div>
            <div>
              <h4>Platform</h4>
              <Link href="#platform">SEO Intelligence</Link>
              <Link href="#ai-visibility">AI Visibility</Link>
              <Link href="#agency">Agency Workspace</Link>
              <Link href="#pricing">Pricing</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link href="#">About</Link>
              <Link href="#">Research</Link>
              <Link href="#">Partners</Link>
              <Link href="#">Contact</Link>
            </div>
            <div>
              <h4>Trust</h4>
              <Link href="#security">Security</Link>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Status</Link>
            </div>
          </div>
          <div className="legal">
            <span>© 2026 LLMOptimizer.ai. All rights reserved.</span>
            <span>Built for the Answer Era.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
