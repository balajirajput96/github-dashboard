/*
 * Style reminder: Signal Ledger — contemporary editorialism with Swiss information design,
 * warm paper surfaces, ink-black navigation, IBM Plex metadata, ruled ledger lines,
 * and Signal Lime reserved for healthy/active states.
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { getPortfolioPresentation } from "@/lib/portfolioPresentation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Clock3,
  Code2,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  Github,
  ImageIcon,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogOut,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Plus,
  RefreshCw,
  Search,
  Send,
  ServerCog,
  Settings2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Video,
  Workflow,
  X,
} from "lucide-react";

const snapshotRepos = [
  {
    name: "mcp",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "11 Aug 2026 · 16:41",
    language: "C#",
    status: "Attention",
    score: "78",
    openPrs: 2,
    alerts: 63,
    description: "The primary MCP workspace with an active review queue.",
    url: "https://github.com/balajirajput96/mcp",
  },
  {
    name: ".github",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "11 Aug 2026 · 04:48",
    language: "Config",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "Organization-wide defaults and contribution templates.",
    url: "https://github.com/balajirajput96/.github",
  },
  {
    name: "manus-advanced-demo",
    owner: "balajirajput96",
    visibility: "Private",
    pushed: "05 Aug 2026 · 03:29",
    language: "TypeScript",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "Private automation experiments consolidated during the task.",
    url: "https://github.com/balajirajput96/manus-advanced-demo",
  },
  {
    name: "gallery",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "23 Jul 2026 · 22:30",
    language: "TypeScript",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "A visual repository with a quieter recent activity line.",
    url: "https://github.com/balajirajput96/gallery",
  },
  {
    name: "mcp-foundry",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "16 Jul 2026 · 20:36",
    language: "C#",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "A companion MCP workspace from the repository snapshot.",
    url: "https://github.com/balajirajput96/mcp-foundry",
  },
  {
    name: "openclaw",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "09 Jul 2026 · 17:17",
    language: "JavaScript",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "An automation-oriented repository in the wider account snapshot.",
    url: "https://github.com/balajirajput96/openclaw",
  },
];

const activityItems = [
  { time: "15 Aug", label: "Daily workflow recovered", detail: "vscode-copilot-cha · Daily Pharma Job Scan · success in 32s", tone: "lime" },
  { time: "15 Aug", label: "CI repair merged", detail: "github-mcp-server- · PR #42 · Docker and workflow fix", tone: "lime" },
  { time: "15 Aug", label: "Dependency remediation merged", detail: "github-mcp-server- · PR #41 · body-parser 2.2.1", tone: "lime" },
  { time: "15 Aug", label: "Dependency validation merged", detail: "vscode-copilot-cha · PR #2 · client build passed", tone: "lime" },
];

const portfolioAudit = {
  totalRepos: "194",
  directlyOwned: "11",
  observedForks: "183",
  remediationPr: "03",
  blockers: "02",
};

function LogoMark() {
  return (
    <div className="brand-lockup" aria-label="ledger slash slash gh">
      <div className="brand-mark"><span /></div>
      <span className="brand-wordmark"><b>ledger</b><em>//gh</em></span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isAttention = status === "Attention";
  const isObserved = status === "Observed";
  return (
    <span className={`status-pill ${isAttention ? "is-attention" : isObserved ? "is-observed" : ""}`}>
      {isAttention ? <CircleAlert size={13} /> : isObserved ? <CircleDashed size={13} /> : <CircleCheck size={13} />}
      {status}
    </span>
  );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-top">
        <LogoMark />
        <button className="icon-button sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeft size={17} /> : <Menu size={17} />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <p className="nav-label">Workspace</p>
        <a className="nav-item is-active" href="#overview"><LayoutDashboard size={17} /><span>Overview</span><b>01</b></a>
        <a className="nav-item" href="#repositories"><Github size={17} /><span>Repositories</span><b>06</b></a>
        <a className="nav-item" href="#activity"><Activity size={17} /><span>Activity</span><b>04</b></a>
        <p className="nav-label nav-label-spaced">Signals</p>
        <a className="nav-item" href="#security"><ShieldCheck size={17} /><span>Security</span><b className="nav-risk">63</b></a>
        <a className="nav-item" href="#workflows"><Workflow size={17} /><span>Workflows</span><b>—</b></a>
        <p className="nav-label nav-label-spaced">Create</p>
        <a className="nav-item" href="#agent-studio"><Sparkles size={17} /><span>Agent Studio</span><b>AI</b></a>
        <a className="nav-item" href="#media-workbench"><ImageIcon size={17} /><span>Media</span><b>01</b></a>
      </nav>

      <div className="sidebar-bottom">
        <div className="rail-note">
          <Sparkles size={16} />
          <div><strong>Snapshot mode</strong><span>Data collected in this task</span></div>
        </div>
        <a className="nav-item" href="#settings"><Settings2 size={17} /><span>Settings</span></a>
        <div className="account-chip"><span className="avatar">BR</span><div><strong>balajirajput96</strong><span>GitHub account</span></div><MoreHorizontal size={16} /></div>
      </div>
    </aside>
  );
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  const { user, loading, isAuthenticated, logout } = useAuth();
  const portfolioQuery = trpc.cockpit.portfolio.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRepo, setSelectedRepo] = useState("mcp");
  const [syncedAt, setSyncedAt] = useState("just now");
  const [agentIntent, setAgentIntent] = useState<"repository" | "automation" | "media">("repository");
  const [agentPrompt, setAgentPrompt] = useState("Review the currently open pull requests and propose the smallest safe next action for each.");
  const [imagePrompt, setImagePrompt] = useState("An editorial software-agent control room with a calm paper ledger, branching code signals, and lime operational markers.");
  const portfolioPresentation = getPortfolioPresentation({
    isLoading: portfolioQuery.isLoading,
    isFetching: portfolioQuery.isFetching,
    hasData: Boolean(portfolioQuery.data),
  });

  const planner = trpc.agent.plan.useMutation({
    onSuccess: () => toast.success("Reviewable agent plan ready", { description: "No external action was performed." }),
    onError: (error) => toast.error("Plan could not be generated", { description: error.message }),
  });
  const imageMaker = trpc.agent.image.useMutation({
    onSuccess: () => toast.success("Original workspace visual created", { description: "The generated asset is stored server-side." }),
    onError: (error) => toast.error("Image could not be created", { description: error.message }),
  });

  const filteredRepos = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return snapshotRepos.filter((repo) => {
      const matchesQuery = !normalized || `${repo.name} ${repo.language} ${repo.visibility}`.toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || repo.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const selected = snapshotRepos.find((repo) => repo.name === selectedRepo) ?? snapshotRepos[0];

  const refresh = () => {
    void portfolioQuery.refetch();
    setSyncedAt("refresh requested");
    toast.success("Live register refreshed", { description: "The cockpit refreshed its server-side public GitHub read." });
  };

  const focusAttention = () => {
    setFilter("Attention");
    document.getElementById("repositories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const createPlan = () => {
    void planner.mutateAsync({ intent: agentIntent, prompt: agentPrompt });
  };

  const createImage = () => {
    void imageMaker.mutateAsync({ prompt: imagePrompt });
  };

  if (loading) {
    return (
      <main className="access-gate ledger-loading-state">
        <aside className="loading-rail"><LogoMark /><span>PRIVATE<br />REGISTER</span></aside>
        <section className="loading-ledger">
          <p className="eyebrow"><span className="eyebrow-rule" /> SESSION CHECK</p>
          <h1>Reading your<br /><i>repository signals.</i></h1>
          <div className="loading-rule"><span /><span /><span /></div>
          <div className="loading-status"><Loader2 className="animate-spin" size={17} /><span>Verifying private workspace access</span><b>01</b></div>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="access-gate access-gate-card">
        <div className="brand-lockup"><div className="brand-mark"><span /></div><span className="brand-wordmark"><b>ledger</b><em>//gh</em></span></div>
        <p className="eyebrow"><span className="eyebrow-rule" /> PRIVATE WORKSPACE</p>
        <h1>Repository intelligence,<br /><i>kept on your side.</i></h1>
        <p>This cockpit reads public GitHub data through protected server routes and never places credentials in the browser.</p>
        <button className="button button-primary" onClick={startLogin}>Sign in to cockpit <ArrowUpRight size={16} /></button>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <main className="main-canvas" id="overview">
        <header className="topbar">
          <div className="breadcrumbs"><span>Private workspace</span><span>/</span><strong>GitHub cockpit</strong></div>
          <div className="topbar-actions">
            <span className="sync-note"><span className="sync-dot" /> {portfolioPresentation.topbarLabel} · {syncedAt}</span>
            <button className="button button-ghost" onClick={refresh}><RefreshCw size={15} />Refresh</button>
            <button className="icon-button" onClick={() => void logout()} aria-label="Sign out"><LogOut size={16} /></button>
            <button className="icon-button" aria-label="More workspace options"><MoreHorizontal size={18} /></button>
          </div>
        </header>

        <div className="page-content">
          <section className="hero-block" aria-labelledby="page-title">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-rule" /> PORTFOLIO AUDIT · 15 AUG 2026</p>
              <h1 id="page-title">Your portfolio is mapped.<br /><i>Three merges and one recovered workflow.</i></h1>
              <p className="hero-description">A verified register of the accessible GitHub portfolio: 194 repositories audited, 11 directly owned projects triaged, three validated changes merged, and the blocked daily workflow recovered.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="https://github.com/balajirajput96/github-mcp-server-/pull/42" target="_blank" rel="noreferrer">Open merged repair <ArrowUpRight size={16} /></a>
                <button className="text-link" onClick={focusAttention}>Inspect earlier detail sample <ArrowUpRight size={14} /></button>
              </div>
            </div>
            <div className="hero-art" aria-label="Abstract repository pulse illustration">
              <img src="/manus-storage/repository-pulse-art_58518160.png" alt="Abstract branching repository signal illustration" />
              <div className="hero-art-caption"><span>Audit / 15</span><strong>Workflow recovery confirmed</strong></div>
            </div>
          </section>

          <section className="metric-strip" aria-label="Repository health summary">
            <div className="metric-cell"><span className="metric-label">Repositories audited</span><strong>{portfolioAudit.totalRepos}</strong><span className="metric-foot"><Github size={13} /> {portfolioAudit.directlyOwned} directly owned</span></div>
            <div className="metric-cell metric-highlight"><span className="metric-label">Validated repairs</span><strong>{portfolioAudit.remediationPr}</strong><span className="metric-foot"><Check size={13} /> PRs #42, #41, #2 merged</span></div>
            <div className="metric-cell"><span className="metric-label">Observed upstream forks</span><strong>{portfolioAudit.observedForks}</strong><span className="metric-foot"><GitBranch size={13} /> tracked, not auto-modified</span></div>
            <div className="metric-cell"><span className="metric-label">Setup blockers</span><strong>{portfolioAudit.blockers}</strong><span className="metric-foot"><TriangleAlert size={13} /> Azure setup and draft review</span></div>
          </section>

          <section className="audit-ledger-strip" aria-label="Latest portfolio audit note">
            <div><span className="signal-label"><span className="signal-dot lime" /> VERIFIED AUDIT NOTE</span><strong><code>vscode-copilot-cha</code> Daily Pharma Job Scan recovered successfully after secure credential configuration.</strong></div>
            <span>11 owned projects triaged · 2 explicit blockers remain</span>
          </section>

          <section className="live-register-section" id="live-register" aria-labelledby="live-register-title">
            <div className="section-heading repository-heading">
              <div><p className="panel-kicker">Free-first live register</p><h2 id="live-register-title">Public GitHub evidence, server-side</h2></div>
              <span className={`live-state ${portfolioPresentation.isLive ? "is-live" : ""}`}>{portfolioPresentation.badgeLabel}</span>
            </div>
            <p className="live-register-intro">This register reads the owner’s public repository metadata through the server. It opens GitHub for every consequential action; it does not write, merge, retry, or store a GitHub credential.</p>

            {portfolioQuery.isLoading ? <div className="live-loading"><Loader2 className="animate-spin" size={18} /> Reading public GitHub portfolio…</div> : null}
            {portfolioQuery.error ? <div className="live-error"><TriangleAlert size={18} /><div><strong>Live register is temporarily unavailable.</strong><span>{portfolioQuery.error.message}</span></div></div> : null}
            {portfolioQuery.data ? (
              <>
                <div className="live-summary-grid">
                  <div><span>Public repositories</span><strong>{portfolioQuery.data.summary.repositories}</strong></div>
                  <div><span>Active in 30 days</span><strong>{portfolioQuery.data.summary.activeLast30Days}</strong></div>
                  <div><span>Open signals</span><strong>{portfolioQuery.data.summary.openSignals}</strong></div>
                  <div><span>Archived</span><strong>{portfolioQuery.data.summary.archived}</strong></div>
                </div>
                <div className="live-ledger-grid">
                  {portfolioQuery.data.repositories.slice(0, 8).map((repo) => (
                    <article className="live-repo-card" key={repo.fullName}>
                      <div><span className={`health-dot ${repo.health}`} /><code>{repo.fullName}</code></div>
                      <strong>{repo.description || "No repository description"}</strong>
                      <span>{repo.language} · {repo.openSignals} open signals · {repo.archived ? "archived" : "active"}</span>
                      <div className="live-quicklinks" aria-label={`${repo.fullName} quick links`}>
                        <a href={repo.htmlUrl} target="_blank" rel="noreferrer">Repo <ArrowUpRight size={12} /></a>
                        <a href={`${repo.htmlUrl}/issues`} target="_blank" rel="noreferrer">Issues</a>
                        <a href={`${repo.htmlUrl}/pulls`} target="_blank" rel="noreferrer">PRs</a>
                        <a href={`${repo.htmlUrl}/actions`} target="_blank" rel="noreferrer">Runs</a>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="action-desk">
                  <div className="action-desk-heading"><div><p className="panel-kicker">Action desk</p><h3>Safe next moves</h3></div><span>Review before write</span></div>
                  <div className="action-card-grid">
                    {portfolioQuery.data.actionCards.length > 0 ? portfolioQuery.data.actionCards.map((card) => (
                      <a key={card.id} href={card.href} target="_blank" rel="noreferrer" className={`action-card ${card.tone}`}><span>{card.tone === "attention" ? "Needs review" : card.tone === "dormant" ? "Dormant" : "Observe"}</span><strong>{card.title}</strong><p>{card.detail}</p><em>Open in GitHub <ArrowUpRight size={13} /></em></a>
                    )) : <div className="action-card observed"><span>Clear</span><strong>No deterministic review card is currently required.</strong><p>The public register has no open issue/PR signal for the listed repositories.</p></div>}
                  </div>
                </div>
              </>
            ) : null}
          </section>

          <section className="agent-studio" id="agent-studio" aria-labelledby="agent-studio-title">
            <div className="agent-studio-intro">
              <p className="panel-kicker">Hybrid agent desk</p>
              <h2 id="agent-studio-title">Reason in the app.<br /><i>Review in GitHub.</i></h2>
              <p>Use on-demand planning for code, automation, or media work. Plans are bounded to inspection, drafts, and review steps; repository writes remain a deliberate GitHub action.</p>
              <div className="agent-boundaries"><span><ShieldCheck size={14} /> no automatic merges</span><span><GitPullRequest size={14} /> PR-based delivery</span><span><Workflow size={14} /> deterministic checks first</span></div>
            </div>
            <div className="agent-workbench">
              <div className="agent-mode-tabs" role="group" aria-label="Agent plan type">
                {(["repository", "automation", "media"] as const).map((intent) => <button key={intent} className={agentIntent === intent ? "is-active" : ""} onClick={() => setAgentIntent(intent)}>{intent}</button>)}
              </div>
              <label className="agent-prompt-label" htmlFor="agent-prompt">What should the agent prepare?</label>
              <textarea id="agent-prompt" value={agentPrompt} onChange={(event) => setAgentPrompt(event.target.value)} maxLength={1500} />
              <div className="agent-workbench-actions"><span>{agentPrompt.length}/1500</span><button className="button button-primary" disabled={planner.isPending || agentPrompt.trim().length < 12} onClick={createPlan}>{planner.isPending ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}{planner.isPending ? "Planning" : "Generate safe plan"}</button></div>
              {planner.data ? <article className="agent-plan-result"><div><span className="signal-label"><span className="signal-dot lime" /> plan ready</span><strong>{planner.data.title}</strong><p>{planner.data.summary}</p></div><ol>{planner.data.steps.map((step, index) => <li key={`${step.title}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><div><span>{step.mode}</span><strong>{step.title}</strong><p>{step.detail}</p></div></li>)}</ol><div className="agent-guardrails"><span>Guardrails</span>{planner.data.guardrails.map((rule) => <em key={rule}>{rule}</em>)}</div></article> : null}
            </div>
          </section>

          <section className="media-workbench" id="media-workbench" aria-labelledby="media-workbench-title">
            <div><p className="panel-kicker">Media studio</p><h2 id="media-workbench-title">Create a visual.<br /><i>Prepare the motion brief.</i></h2><p>Image work is an authenticated on-demand server action. Video briefs become structured shot plans until a separately approved video provider is connected.</p></div>
            <div className="media-tools">
              <div className="media-tool-card">
                <ImageIcon size={19} /><div><strong>Original image</strong><span>Generate a workspace visual without putting a key in the browser.</span></div>
                <label className="sr-only" htmlFor="image-prompt">Image request</label><input id="image-prompt" value={imagePrompt} onChange={(event) => setImagePrompt(event.target.value)} maxLength={700} /><button className="button button-dark" disabled={imageMaker.isPending || imagePrompt.trim().length < 12} onClick={createImage}>{imageMaker.isPending ? <Loader2 className="animate-spin" size={15} /> : <Sparkles size={15} />}{imageMaker.isPending ? "Creating" : "Create image"}</button>
                {imageMaker.data?.url ? <a className="media-image-result" href={imageMaker.data.url} target="_blank" rel="noreferrer"><img src={imageMaker.data.url} alt="Generated agent workspace visual" /><span>Open generated image <ArrowUpRight size={13} /></span></a> : null}
              </div>
              <div className="media-tool-card is-muted"><Video size={19} /><div><strong>Video shot plan</strong><span>Turn a video request into a reviewable production brief before a provider is connected.</span></div><button className="button button-ghost" onClick={() => { setAgentIntent("media"); setAgentPrompt("Create a production-ready video shot plan for: "); document.getElementById("agent-studio")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>Prepare video plan <ArrowUpRight size={15} /></button></div>
            </div>
          </section>

          <section className="overview-grid">
            <article className="panel pulse-panel">
              <div className="panel-heading"><div><p className="panel-kicker">Repository pulse</p><h2>Signal movement</h2></div><span className="index-stamp">01</span></div>
              <div className="pulse-visual">
              <div className="pulse-copy"><span className="signal-label"><span className="signal-dot lime" /> WORKFLOW RECOVERED</span><strong>32<span>s</span></strong><p>Daily Pharma Job Scan completed successfully after the repository credential was configured through encrypted Actions secrets.</p><a className="button button-small" href="https://github.com/balajirajput96/vscode-copilot-cha/actions/runs/31874690138" target="_blank" rel="noreferrer">Inspect successful run <ArrowUpRight size={14} /></a></div>
                <img src="/manus-storage/workflow-rhythm-art_833a79bf.png" alt="Abstract workflow rhythm visual" />
              </div>
              <div className="pulse-legend"><span><i className="legend-mark mark-lime" /> Healthy</span><span><i className="legend-mark mark-rust" /> Needs review</span><span><i className="legend-mark mark-stone" /> Not fetched</span></div>
            </article>

            <article className="panel index-panel" id="security">
              <div className="panel-heading"><div><p className="panel-kicker">Health index</p><h2>Attention, not alarm</h2></div><ShieldCheck size={20} className="panel-icon" /></div>
              <div className="index-number"><span>owned portfolio</span><strong>11</strong><em>projects</em></div>
              <div className="score-bar"><span style={{ width: "73%" }} /></div>
              <p className="index-note">Eight projects have no issue-backed remediation item in the collected audit. Two remain blocked by Azure setup or focused draft review; the scheduled job workflow is now healthy.</p>
              <div className="index-actions"><a className="button button-dark" href="https://github.com/balajirajput96/github-mcp-server-/pull/42" target="_blank" rel="noreferrer">Open repair <ArrowUpRight size={14} /></a><span>Updated {syncedAt}</span></div>
            </article>
          </section>

          <section className="activity-section" id="activity">
            <div className="section-heading"><div><p className="panel-kicker">Recent ledger entries</p><h2>What changed in the portfolio</h2></div><button className="text-link" onClick={() => toast("The activity feed records verified evidence from the 15 Aug portfolio audit.")}>Audit note <ArrowUpRight size={14} /></button></div>
            <div className="activity-grid">
              <div className="activity-list">
                {activityItems.map((item) => <div className="activity-row" key={`${item.time}-${item.label}`}><div className={`activity-marker ${item.tone}`}><Check size={13} /></div><div className="activity-detail"><strong>{item.label}</strong><span>{item.detail}</span></div><time>{item.time}</time></div>)}
              </div>
              <div className="activity-aside"><img src="/manus-storage/workflow-rhythm-art_833a79bf.png" alt="Workflow rhythm texture" /><div><span className="signal-label"><span className="signal-dot rust" /> NEXT MOVE</span><strong>Clear remaining setup blockers</strong><p>The workflow credential blocker is resolved. Remaining work depends on an Azure deployment decision and focused review of larger draft pull requests.</p><a className="text-link" href="https://github.com/balajirajput96/vscode-copilot-cha/actions/runs/31874690138" target="_blank" rel="noreferrer">Open successful workflow <ExternalLink size={13} /></a></div></div>
            </div>
          </section>

          <section className="repositories-section" id="repositories">
            <div className="section-heading repository-heading"><div><p className="panel-kicker">Earlier detail sample</p><h2>Original connector snapshot</h2></div><button className="button button-dark" onClick={() => toast("The full 194-repository audit is documented separately; this static register remains the original drill-down sample.")}><BookOpen size={15} /> Audit scope</button></div>
            <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search repository, language, visibility" aria-label="Search repositories" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</div><div className="filter-tabs" role="group" aria-label="Repository status filter">{["All", "Attention", "Observed"].map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
            <div className="repo-table-wrap">
              <table className="repo-table">
                <thead><tr><th>Repository</th><th>Last pushed</th><th>Visibility</th><th>Signals</th><th>Score</th><th><span className="sr-only">Open</span></th></tr></thead>
                <tbody>
                  {filteredRepos.map((repo) => (
                    <tr key={repo.name} className={selectedRepo === repo.name ? "is-selected" : ""} onClick={() => setSelectedRepo(repo.name)}>
                      <td><a className="repo-name repo-name-link" href={`/repos/${encodeURIComponent(repo.name)}`} onClick={(event) => event.stopPropagation()}><span className="repo-icon"><Code2 size={15} /></span><div><strong>{repo.name}</strong><span>{repo.owner} · {repo.language}</span></div></a></td>
                      <td><span className="mono-cell">{repo.pushed}</span></td>
                      <td><span className="visibility-cell">{repo.visibility === "Private" ? <LockKeyhole size={13} /> : <Github size={13} />}{repo.visibility}</span></td>
                      <td><div className="signal-stack"><StatusPill status={repo.status} /><span>{repo.alerts === "—" ? "No alert data" : `${repo.alerts} alerts`}</span></div></td>
                      <td><span className={`score-cell ${repo.status === "Attention" ? "is-risk" : ""}`}>{repo.score}</span></td>
                      <td><a className="row-link" href={`/repos/${encodeURIComponent(repo.name)}`} aria-label={`Open ${repo.name} detail page`} onClick={(event) => event.stopPropagation()}><ArrowUpRight size={16} /></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRepos.length === 0 && <div className="empty-state"><Search size={18} /><strong>No repositories match that filter.</strong><span>Try a different name or return to All.</span></div>}
            </div>
            <div className="table-footnote"><span><CircleDashed size={13} /> Snapshot fields with an em dash were not fetched.</span><span>{filteredRepos.length} of {snapshotRepos.length} shown</span></div>
          </section>

          <section className="provider-studio" id="settings" aria-labelledby="provider-studio-title">
            <div><p className="panel-kicker">Provider studio</p><h2 id="provider-studio-title">Connect later, never pretend now.</h2><p>Free-first mode keeps third-party model, image, and video credentials out of this application. The controls below are deliberate readiness states, not inactive promises.</p></div>
            <div className="provider-grid">
              <div><Sparkles size={18} /><strong>AI composition</strong><span>Enabled for authenticated, on-demand safe plans using the server-side model boundary.</span></div>
              <div><ServerCog size={18} /><strong>Image & video work</strong><span>Image creation is available on demand; rendered video still needs a separately approved provider.</span></div>
              <div><ShieldCheck size={18} /><strong>Repository writes</strong><span>Remain GitHub-reviewable until a dedicated owner token and approval policy are added.</span></div>
            </div>
          </section>

          <footer className="page-footer"><span>ledger//gh · repository health, without the noise</span><span>{user?.email || "Private owner session"} · public GitHub reads + preserved audit evidence</span></footer>
        </div>
      </main>
    </div>
  );
}
