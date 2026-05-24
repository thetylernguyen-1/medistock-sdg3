import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RequestFormPreview() {
  return (
    <Card className="border-sky-100 bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle>Stock request form</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="facility">Facility</Label>
            <Input id="facility" defaultValue="Sunrise Health Post" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="request-medicine">Medicine</Label>
            <Input id="request-medicine" defaultValue="MMR Vaccine" />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="requested-qty">Quantity requested</Label>
            <Input id="requested-qty" type="number" defaultValue="30" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="needed-by">Needed by</Label>
            <Input id="needed-by" defaultValue="Within 48 hours" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            defaultValue="Child vaccination outreach session planned for the weekend."
          />
        </div>
        <Button className="w-full bg-sky-700 hover:bg-sky-800">Submit request</Button>
      </CardContent>
    </Card>
  );
}
