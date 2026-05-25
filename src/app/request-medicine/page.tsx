import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { RequestFormPreview } from "@/components/forms/request-form-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stockRequests } from "@/data/mock-data";

export default function RequestMedicinePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <RequestFormPreview />
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Request Medicine</h1>
          <p className="text-slate-600">
            Track simple resupply requests between Kenya sample facilities without
            adding complex workflow or patient data.
          </p>
        </div>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Recent requests</CardTitle>
              <DemoInventoryBadge />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-slate-900">{request.medicineName}</h2>
                    <p className="text-sm text-slate-500">{request.clinicName}</p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-900">
                    {request.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Quantity requested: {request.quantityRequested}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
