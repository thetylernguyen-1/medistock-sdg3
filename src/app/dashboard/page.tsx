import { DashboardChartPanel } from "@/components/charts/dashboard-chart-panel";
import { StatCard } from "@/components/cards/stat-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMetrics } from "@/data/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Dashboard</h1>
        <p className="max-w-3xl text-slate-600">
          A public-facing summary of stock visibility, with plain-language alerts that
          help teams respond without sounding alarmist.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <StatCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertTitle>Low-stock watch</AlertTitle>
        <AlertDescription>
          Two facilities need resupply coordination this week. This dashboard is for
          inventory awareness only and does not provide medical guidance.
        </AlertDescription>
      </Alert>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>Weekly stock trend</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardChartPanel />
        </CardContent>
      </Card>
    </div>
  );
}
