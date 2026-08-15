import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getPublicPortfolio } from "./githubPublic";

const agentIntentSchema = z.enum(["repository", "automation", "media"]);

const agentPlanSchema = z.object({
  title: z.string().min(3).max(90),
  summary: z.string().min(10).max(480),
  steps: z.array(z.object({
    title: z.string().min(3).max(90),
    detail: z.string().min(8).max(280),
    mode: z.enum(["inspect", "draft", "review"]),
  })).min(2).max(5),
  guardrails: z.array(z.string().min(4).max(180)).min(2).max(5),
});

const agentPlanJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          mode: { type: "string", enum: ["inspect", "draft", "review"] },
        },
        required: ["title", "detail", "mode"],
        additionalProperties: false,
      },
    },
    guardrails: { type: "array", items: { type: "string" } },
  },
  required: ["title", "summary", "steps", "guardrails"],
  additionalProperties: false,
} as const;

const plannerContext: Record<z.infer<typeof agentIntentSchema>, string> = {
  repository: "Plan a repository-health or code-review task. Do not claim to run commands, merge pull requests, alter repository settings, or access private data.",
  automation: "Plan a deterministic automation task. Prefer a GitHub Actions workflow or reviewable draft over uncontrolled background execution. Do not schedule or trigger an external workflow yourself.",
  media: "Plan an image or video production task. Images can be created on demand; video output requires a separately configured provider, so provide a bounded shot-plan rather than claiming a rendered video.",
};

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  cockpit: router({
    portfolio: protectedProcedure
      .input(z.object({ forceRefresh: z.boolean().optional() }).optional())
      .query(({ input }) => getPublicPortfolio("balajirajput96", input?.forceRefresh ?? false)),
  }),
  agent: router({
    plan: protectedProcedure
      .input(z.object({
        intent: agentIntentSchema,
        prompt: z.string().trim().min(12).max(1_500),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          maxTokens: 1_400,
          messages: [
            {
              role: "system",
              content: "You are the planning core for a private GitHub agent workspace. Return only the requested strict JSON. Every plan must be safe, concise, and reviewable. Never instruct credential sharing, automatic merges, destructive commands, or unreviewed external posting.",
            },
            {
              role: "user",
              content: `${plannerContext[input.intent]}\n\nUser request:\n${input.prompt}`,
            },
          ],
          outputSchema: {
            name: "hybrid_agent_plan",
            strict: true,
            schema: agentPlanJsonSchema,
          },
        });

        const content = response.choices[0]?.message.content;
        if (typeof content !== "string") {
          throw new Error("The planning model returned no text response");
        }

        return agentPlanSchema.parse(JSON.parse(content));
      }),
    image: protectedProcedure
      .input(z.object({ prompt: z.string().trim().min(12).max(700) }))
      .mutation(async ({ input }) => {
        const result = await generateImage({
          prompt: `Create an original professional visual for a private software-agent workspace. ${input.prompt}. Do not include credentials, secrets, account names, logos, watermarks, or unreadably dense text.`,
        });
        if (!result.url) throw new Error("The image service did not return an image URL");
        return { url: result.url };
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
