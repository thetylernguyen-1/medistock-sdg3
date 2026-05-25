"use client";

import dynamic from "next/dynamic";

const StockRiskChart = dynamic(
  () => import("@/components/charts/stock-risk-chart").then((mod) => mod.StockRiskChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        Loading chart...
      </div>
    ),
  },
);

type DashboardChartPanelProps = {
  data: {
    name: string;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }[];
};

export function DashboardChartPanel({ data }: DashboardChartPanelProps) {
  return <StockRiskChart data={data} />;
}
