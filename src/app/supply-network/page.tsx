import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { MedicalDisclaimer } from "@/components/cards/medical-disclaimer";
import { SupplyNetworkGraph } from "@/components/graph/SupplyNetworkGraph";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupplyNetworkPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-teal-100 bg-white/90 p-8 shadow-[0_28px_90px_-52px_rgba(15,118,110,0.5)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_38%)]" />
        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-teal-600 px-3 py-1 text-white hover:bg-teal-600">
              SDG 3 explorer
            </Badge>
            <DemoInventoryBadge />
          </div>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Health Supply Knowledge Graph Explorer
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Explore how county coverage, facility capacity, essential medicines,
              citizen requests, and shortage risk can connect in a practical Kenya
              health-access demo.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-white/70 bg-white/75 shadow-none backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">Why it matters for SDG 3</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-slate-600">
                Better visibility into supply relationships can help teams reason about
                access gaps, referral pressure, and where citizens may face friction
                when seeking essential medicines.
              </CardContent>
            </Card>
            <Card className="border-white/70 bg-white/75 shadow-none backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">What is grounded in local data</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-slate-600">
                County and facility context comes from cleaned Kenya health-facility
                source data already stored in the app.
              </CardContent>
            </Card>
            <Card className="border-white/70 bg-white/75 shadow-none backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">What stays simulated</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-slate-600">
                Inventory values, citizen requests, and shortage links are demo-only,
                not real-time, and should not be used as medical advice.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SupplyNetworkGraph />

      <MedicalDisclaimer />
    </div>
  );
}
