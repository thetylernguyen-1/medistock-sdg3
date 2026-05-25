"use client";

import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { DashboardChartPanel } from "@/components/charts/dashboard-chart-panel";
import { StatCard } from "@/components/cards/stat-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoInventoryState } from "@/lib/demo-inventory-state";

export default function DashboardPage() {
  const { snapshot } = useDemoInventoryState();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Dashboard</h1>
        <p className="max-w-3xl text-slate-600">
          A Kenya-focused public summary that combines real facility-location context
          with simulated demo inventory trends.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {snapshot.dashboardMetrics.map((metric) => (
          <StatCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertTitle className="flex flex-wrap items-center gap-2">
          Low-stock watch
          <DemoInventoryBadge />
        </AlertTitle>
        <AlertDescription>
          {snapshot.summaryAlert} This dashboard is for inventory awareness only and does not
          provide medical guidance.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle>County snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {snapshot.countySummaries.map((county) => (
              <div key={county.county} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{county.county}</p>
                    <p className="text-sm text-slate-500">{county.facilities} facilities in the demo sample</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-amber-100 text-amber-900">{county.lowStock} low stock</Badge>
                    <Badge className="bg-rose-100 text-rose-900">{county.outOfStock} out of stock</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle>Medicines to watch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.priorityMedicines.map((medicine) => (
              <div key={medicine.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{medicine.name}</p>
                  <DemoInventoryBadge />
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {medicine.outOfStock} out of stock, {medicine.lowStock} low stock
                  across the sample facilities.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Weekly stock trend</CardTitle>
            <DemoInventoryBadge />
          </div>
        </CardHeader>
        <CardContent>
          <DashboardChartPanel data={snapshot.stockTrend} />
        </CardContent>
      </Card>
    </div>
  );
}
