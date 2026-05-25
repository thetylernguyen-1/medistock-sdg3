"use client";

import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupplyGraphEdge, SupplyGraphNode } from "@/lib/graph-data";

type GraphNodeDetailsProps = {
  node: SupplyGraphNode | null;
  connectedNodes: SupplyGraphNode[];
  edges: SupplyGraphEdge[];
};

export function GraphNodeDetails({ node, connectedNodes, edges }: GraphNodeDetailsProps) {
  if (!node) {
    return (
      <Card className="border-white/60 bg-white/90 shadow-[0_20px_60px_-36px_rgba(14,116,144,0.5)]">
        <CardHeader>
          <CardTitle>Node details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
          <p>Select a county, facility, medicine, stock state, request, or risk node to inspect its role in the MediStock Kenya supply network.</p>
          <p>The explorer uses local app data only. Inventory is demo inventory and not real-time.</p>
        </CardContent>
      </Card>
    );
  }

  const relatedEdges = edges.filter((edge) => edge.from === node.id || edge.to === node.id);

  return (
    <Card className="border-white/60 bg-white/90 shadow-[0_20px_60px_-36px_rgba(14,116,144,0.5)]">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-teal-100 text-teal-900 hover:bg-teal-100">{node.label}</Badge>
          <DemoInventoryBadge />
        </div>
        <div className="space-y-1">
          <CardTitle>{node.title}</CardTitle>
          {node.subtitle ? <p className="text-sm text-slate-500">{node.subtitle}</p> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2">
          {node.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="w-fit border-sky-200 bg-sky-50 text-sky-900">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-2 text-sm leading-7 text-slate-600">
          {node.detailLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {node.metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Connected nodes</p>
          <div className="flex flex-wrap gap-2">
            {connectedNodes.length ? (
              connectedNodes.map((connectedNode) => (
                <Badge key={connectedNode.id} variant="outline" className="border-slate-200 text-slate-700">
                  {connectedNode.title}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-500">No connections are visible for the current filters.</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Relationship lines</p>
          <div className="space-y-2 text-sm text-slate-600">
            {relatedEdges.length ? (
              relatedEdges.map((edge) => (
                <div key={edge.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {edge.label}
                </div>
              ))
            ) : (
              <p>No relationship lines are visible for this node.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
