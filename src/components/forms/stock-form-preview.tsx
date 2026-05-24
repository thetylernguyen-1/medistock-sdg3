import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function StockFormPreview() {
  return (
    <Card className="border-teal-100 bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle>Inventory update form</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="clinic">Clinic</Label>
          <Input id="clinic" defaultValue="Green Valley Clinic" />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="medicine">Medicine</Label>
            <Input id="medicine" defaultValue="Paracetamol" />
          </div>
          <div className="grid gap-2">
            <Label>Stock status</Label>
            <Select defaultValue="in-stock">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" defaultValue="128" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            defaultValue="Batch checked this morning. Cold-chain storage confirmed."
          />
        </div>
        <Button className="w-full bg-teal-600 hover:bg-teal-700">Save draft update</Button>
      </CardContent>
    </Card>
  );
}
