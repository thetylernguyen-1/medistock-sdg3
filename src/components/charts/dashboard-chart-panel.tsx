"use client";

import dynamic from "next/dynamic";

import { stockTrend } from "@/data/mock-data";

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

export function DashboardChartPanel() {
  return <StockRiskChart data={stockTrend} />;
}
