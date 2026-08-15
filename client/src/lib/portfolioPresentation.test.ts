import { describe, expect, it } from "vitest";
import { getPortfolioPresentation } from "./portfolioPresentation";

describe("portfolio presentation state", () => {
  it("renders a live state when an authenticated portfolio query returns data", () => {
    expect(getPortfolioPresentation({ isLoading: false, isFetching: false, hasData: true })).toEqual({
      topbarLabel: "Live public register",
      badgeLabel: "Live",
      isLive: true,
    });
  });

  it("does not mislabel a pending query as a snapshot fallback", () => {
    expect(getPortfolioPresentation({ isLoading: true, isFetching: true, hasData: false })).toMatchObject({
      topbarLabel: "Reading live register",
      badgeLabel: "Reading",
      isLive: false,
    });
  });
});
