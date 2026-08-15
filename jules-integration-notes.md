# Jules integration findings

Official Jules documentation confirms that a user signs in at `jules.google.com` with a Google account, accepts the privacy notice once, and then connects a GitHub account. The connection flow permits selecting all repositories or a specified subset. Jules works in a virtual machine, creates a plan for a task, and expects the user to review and approve the plan before code changes proceed.

Jules also supports recurring tasks created from the task input's Planning menu. A recurring task supports daily or weekly cadence and is managed from the Scheduled tab; existing scheduled tasks must be deleted and recreated to change their configuration. This makes a narrow, reviewable maintenance prompt preferable to a broad request to change every repository automatically.

Sources: [Getting started](https://jules.google/docs/) and [Scheduled Tasks](https://jules.google/docs/scheduled-tasks/), accessed 15 Aug 2026.

## Verified account state

On 15 Aug 2026, Jules was successfully authenticated with the Google account shown in the Jules browser session. Its connected GitHub selector exposed the `balajirajput96` account and a broad repository list, including `.github`, `github-dashboard`, `mcp`, `github-mcp-server-`, `vscode-copilot-cha`, and many additional repositories. This confirms that repository selection is available in Jules; it does not make a blanket, unattended code-change policy safe or appropriate.

The Jules Scheduled view was checked on 15 Aug 2026 and currently contains no recurring tasks. Jules displays schedules in the context of the currently selected repository, so a single native Jules task does not automatically span all repositories. A workable cross-portfolio program must therefore either create scoped schedules for individual repositories or use a daily portfolio triage to select a single high-priority repository for that day.

The first daily maintenance candidate is `balajirajput96/github-mcp-server-`, selected because it is an active owned repository with the largest currently observed open-work queue. A scoped, non-destructive maintenance prompt has been prepared in Jules: one high-confidence fix per run, isolated branch and PR, relevant test/lint/build validation, and explicit exclusions for secrets, permissions, deployments, billing, branch protection, resource deletion, merges, and releases. The task has not been submitted or scheduled yet.

The scoped `Daily Safe Repository Maintenance` task was subsequently started for `balajirajput96/github-mcp-server-`. Jules created a new session and now lists it under the repository's Sessions area. This is a repository-scoped session, not yet a verified recurring schedule; its plan and execution status must be reviewed before any coding is approved.

During the initial session, Jules attempted to initialize several external service connections (including Supabase, Neon, Context7, v0, Stitch, Render, Tinybird, and Linear), despite the scoped repository-maintenance prompt. The session was paused before any repository change, plan approval, or pull request creation could be confirmed. This behavior means scheduled Jules work must be limited to a vetted configuration that prevents or explicitly controls external integrations; broad “use every connected account” execution is not an acceptable unattended setting.

Official Jules MCP documentation states that integrations are added through **Settings → MCP** and are invoked in a session when Jules detects a need. The Jules settings screen exposes a dedicated MCP section, separate integrations controls, and pull-request defaults. This confirms that the GitHub-only maintenance program should proceed only after inspecting and removing or disabling any unnecessary MCP connections rather than relying on prompt text alone.

Under the confirmed GitHub-only scope, Linear, Neon, Stitch, Supabase, and Tinybird MCP connections were removed from the Jules MCP settings. Context7, v0, and Render were still visible after this partial cleanup and require separate verification before the paused maintenance session can be recreated safely.

The cleanup is now complete: Context7 and v0 were also disconnected, leaving no connected MCP servers in the Jules MCP panel. Render uses a separate integration setting; its stored API key was retained but **Enable MCP features** was switched off, preventing Jules from using Render's MCP service. The maintenance workflow may now be recreated without these third-party tool connections.

Final verification showed no entries under **Connected MCPs**. Render is displayed as **MCP Disabled**, while every previously configured third-party service is listed only as an available connection. This is the required GitHub-only external-integration state for the Jules maintenance program.

## Current program status

The repository workspace at `https://jules.google.com/repo/github/balajirajput96/github-mcp-server-/overview` shows the initial maintenance session as **Paused**. It has not created a confirmed plan, code change, branch, pull request, merge, or release. The repository view includes an explicit **Scheduled** filter and a new-task composer.

## Scheduled task

A native Jules scheduled task was created for `balajirajput96/github-mcp-server-` with the GitHub-only, test-backed maintenance prompt. It is set to run **daily at 03:30 UTC**, which is **09:00 Asia/Kolkata**, until cancelled. The official Jules documentation describes a successfully submitted scheduled task as automatically active at its specified times. The dashboard currently reports **Inactive / No executions yet**, so the program needs a first-run verification at the next scheduled cadence before treating recurring execution as proven. The prior one-off session remains paused and has not made any repository change.

On 15 Aug 2026 at approximately 09:39 Asia/Kolkata, the Jules Scheduled view was rechecked while signed in under the configured Google account. It confirms the native daily task remains present for `balajirajput96/github-mcp-server-`, retains its **03:30 UTC / 09:00 Asia/Kolkata** cadence, and still has **No executions yet**. This is expected because it was created after that day's maintenance window; the next occurrence is the first execution to verify.

The companion Manus schedule, **Daily GitHub owner-repo and Jules update**, is verified **active**. It runs daily at **09:30 Asia/Kolkata** in full-auto mode, after the scheduled Jules window, and is constrained to reporting, evidence-based triage, and the next safe action; it is explicitly prohibited from merging pull requests, deleting repositories or branches, modifying secrets or branch protections, publishing releases, or making billing/permission changes.
