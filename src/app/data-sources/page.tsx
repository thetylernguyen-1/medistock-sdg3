import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { facilities } from "@/data/facilities";
import { dataSourceLabel, dataSourceNotes, featuredCounties, medicines } from "@/data/mock-data";

export default function DataSourcesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Data Sources</h1>
        <p className="max-w-3xl text-slate-600">
          This page explains which parts of MediStock Kenya use curated facility context
          and which parts remain simulated for safe demo use.
        </p>
      </div>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>Facility-location source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
          <p>{dataSourceLabel} provides the location context for this demo.</p>
          <p>
            The runtime app uses a small TypeScript facility dataset designed to show
            Kenyan healthcare-access navigation challenges without depending on raw files at runtime.
          </p>
          <div className="flex flex-wrap gap-2">
            {featuredCounties.map((county) => (
              <Badge key={county} variant="outline" className="border-teal-200 text-teal-800">
                {county}
              </Badge>
            ))}
          </div>
          <p>{facilities.length} facilities are included in the current demo sample.</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>Medicines and inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
          <p>{medicines.length} essential medicines and vaccines are included as demo concepts inspired by common WHO-style essential medicine categories.</p>
          <div className="space-y-2">
            {dataSourceNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
