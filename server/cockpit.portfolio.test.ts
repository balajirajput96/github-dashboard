import { afterEach, describe, expect, it, vi } from "vitest";
import type { User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

const user: User = {
  id: 1,
  openId: "portfolio-test-owner",
  name: "Portfolio Test Owner",
  email: "owner@example.test",
  loginMethod: "test",
  role: "admin",
  createdAt: new Date("2026-08-15T00:00:00.000Z"),
  updatedAt: new Date("2026-08-15T00:00:00.000Z"),
  lastSignedIn: new Date("2026-08-15T00:00:00.000Z"),
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("authenticated cockpit portfolio", () => {
  it("returns normalized live public GitHub data for an authenticated owner", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{
        name: "live-register",
        full_name: "balajirajput96/live-register",
        html_url: "https://github.com/balajirajput96/live-register",
        description: "A live portfolio smoke fixture",
        private: false,
        archived: false,
        fork: false,
        language: "TypeScript",
        open_issues_count: 2,
        pushed_at: "2026-08-15T00:00:00.000Z",
        updated_at: "2026-08-15T00:00:00.000Z",
        stargazers_count: 1,
      }],
    });
    vi.stubGlobal("fetch", fetchMock);

    const caller = appRouter.createCaller({
      user,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    const portfolio = await caller.cockpit.portfolio({ forceRefresh: true });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(portfolio.source).toBe("github-public-api");
    expect(portfolio.summary).toMatchObject({ repositories: 1, openSignals: 2 });
    expect(portfolio.repositories[0]).toMatchObject({
      fullName: "balajirajput96/live-register",
      health: "observed",
      openSignals: 2,
    });
  });
});
