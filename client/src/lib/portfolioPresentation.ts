export type PortfolioPresentationInput = {
  isLoading: boolean;
  isFetching: boolean;
  hasData: boolean;
};

export function getPortfolioPresentation({ isLoading, isFetching, hasData }: PortfolioPresentationInput) {
  if (isLoading) {
    return {
      topbarLabel: "Reading live register",
      badgeLabel: "Reading",
      isLive: false,
    };
  }

  if (isFetching) {
    return {
      topbarLabel: hasData ? "Refreshing live register" : "Reading live register",
      badgeLabel: "Refreshing",
      isLive: hasData,
    };
  }

  if (hasData) {
    return {
      topbarLabel: "Live public register",
      badgeLabel: "Live",
      isLive: true,
    };
  }

  return {
    topbarLabel: "Snapshot fallback",
    badgeLabel: "Snapshot",
    isLive: false,
  };
}
