import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clinics } from "@/data/mock-data";

const statusClasses = {
  "In Stock": "bg-emerald-100 text-emerald-900",
  "Low Stock": "bg-amber-100 text-amber-900",
  "Out of Stock": "bg-rose-100 text-rose-900",
} as const;

export default function FindMedicinePage() {
  const rows = clinics.flatMap((clinic) =>
    clinic.inventory.map((item) => ({
      clinicName: clinic.name,
      area: clinic.area,
      medicineName: item.medicineName,
      quantity: item.quantity,
      status: item.status,
      distanceKm: clinic.distanceKm,
      updatedAt: item.updatedAt,
    })),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Find Medicine</h1>
        <p className="max-w-3xl text-slate-600">
          Compare nearby clinics and pharmacies by medicine availability. Always
          confirm with the provider before making a trip.
        </p>
      </div>
      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>Current stock overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${row.clinicName}-${row.medicineName}`}>
                  <TableCell className="font-medium">{row.medicineName}</TableCell>
                  <TableCell>
                    <div>{row.clinicName}</div>
                    <div className="text-xs text-slate-500">{row.area}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusClasses[row.status]}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.distanceKm.toFixed(1)} km</TableCell>
                  <TableCell>{row.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
