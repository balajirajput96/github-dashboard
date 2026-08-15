import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("hybrid agent access boundary", () => {
  const caller = appRouter.createCaller({
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  });

  it("rejects planning without an authenticated workspace session", async () => {
    await expect(caller.agent.plan({
      intent: "repository",
      prompt: "Review open pull requests and prepare a safe change checklist.",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects image generation without an authenticated workspace session", async () => {
    await expect(caller.agent.image({
      prompt: "An editorial illustration of safe, reviewable software automation.",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
