"use client";

import { useState } from "react";
import { Activity, ArrowRightLeft, CircleAlert, Network, ShieldPlus } from "lucide-react";

import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { GraphFilters } from "@/components/graph/GraphFilters";
import { GraphNodeDetails } from "@/components/graph/GraphNodeDetails";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoInventoryState } from "@/lib/demo-inventory-state";
import {
  buildSupplyNetworkData,
  defaultSupplyNetworkFilters,
  getConnectedNodeIds,
  type SupplyGraphEdge,
  type SupplyGraphNode,
  type SupplyGraphNodeKind,
  type SupplyNetworkFilters,
} from "@/lib/graph-data";

const columnOrder: SupplyGraphNodeKind[] = [
  "county",
  "facility",
  "medicine",
  "status",
  "request",
  "risk",
];

const columnX: Record<SupplyGraphNodeKind, number> = {
  county: 110,
  facility: 300,
  medicine: 520,
  status: 720,
  request: 910,
  risk: 1040,
};

const toneClasses = {
  teal: {
    card: "fill-[#ddfbf4] stroke-[#14b8a6]",
    text: "fill-[#115e59]",
    edge: "#14b8a6",
    glow: "#99f6e4",
  },
  sky: {
    card: "fill-[#e0f2fe] stroke-[#38bdf8]",
    text: "fill-[#075985]",
    edge: "#38bdf8",
    glow: "#bae6fd",
  },
  amber: {
    card: "fill-[#fef3c7] stroke-[#f59e0b]",
    text: "fill-[#92400e]",
    edge: "#f59e0b",
    glow: "#fde68a",
  },
  rose: {
    card: "fill-[#ffe4e6] stroke-[#fb7185]",
    text: "fill-[#9f1239]",
    edge: "#fb7185",
    glow: "#fecdd3",
  },
  slate: {
    card: "fill-[#e2e8f0] stroke-[#94a3b8]",
    text: "fill-[#334155]",
    edge: "#94a3b8",
    glow: "#cbd5e1",
  },
} as const;

function buildNodeLayout(nodes: SupplyGraphNode[]) {
  const grouped = columnOrder.map((kind) => ({
    kind,
    nodes: nodes.filter((node) => node.kind === kind),
  }));

  return grouped.flatMap(({ kind, nodes: kindNodes }) => {
    const gap = 620 / Math.max(kindNodes.length + 1, 2);

    return kindNodes.map((node, index) => ({
      ...node,
      x: columnX[kind],
      y: 70 + gap * (index + 1),
    }));
  });
}

function buildEdgePath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const startX = from.x + 64;
  const endX = to.x - 64;
  const controlOffset = Math.max((endX - startX) * 0.5, 70);

  return `M ${startX} ${from.y} C ${startX + controlOffset} ${from.y}, ${endX - controlOffset} ${to.y}, ${endX} ${to.y}`;
}

function nodeWidth(kind: SupplyGraphNodeKind) {
  if (kind === "facility") return 170;
  if (kind === "medicine") return 156;
  if (kind === "risk") return 168;
  return 140;
}

function NodeCard({
  node,
  isSelected,
  isConnected,
  onClick,
}: {
  node: SupplyGraphNode & { x: number; y: number };
  isSelected: boolean;
  isConnected: boolean;
  onClick: () => void;
}) {
  const width = nodeWidth(node.kind);
  const tone = toneClasses[node.tone];

  return (
    <g
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer outline-none"
    >
      <rect
        x={node.x - width / 2}
        y={node.y - 36}
        rx="20"
        ry="20"
        width={width}
        height="72"
        className={`${tone.card} transition-all duration-200`}
        strokeWidth={isSelected ? 3 : isConnected ? 2.25 : 1.5}
        opacity={isSelected ? 1 : isConnected ? 0.98 : 0.82}
        filter={isSelected ? `drop-shadow(0 0 18px ${tone.glow})` : undefined}
      />
      <text x={node.x - width / 2 + 14} y={node.y - 12} className={`text-[10px] font-bold uppercase tracking-[0.24em] ${tone.text}`}>
        {node.label}
      </text>
      <text x={node.x - width / 2 + 14} y={node.y + 8} className={`text-[12px] font-semibold ${tone.text}`}>
        {node.title.length > 24 ? `${node.title.slice(0, 24)}…` : node.title}
      </text>
      {node.subtitle ? (
        <text x={node.x - width / 2 + 14} y={node.y + 24} className="fill-slate-500 text-[10px]">
          {node.subtitle.length > 30 ? `${node.subtitle.slice(0, 30)}…` : node.subtitle}
        </text>
      ) : null}
    </g>
  );
}

function EdgeLine({
  edge,
  from,
  to,
  active,
}: {
  edge: SupplyGraphEdge;
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
}) {
  const tone = toneClasses[edge.tone];
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g>
      <path
        d={buildEdgePath(from, to)}
        fill="none"
        stroke={tone.edge}
        strokeWidth={active ? 2.6 : 1.5}
        opacity={active ? 0.78 : 0.28}
        strokeDasharray={edge.label === "contributes to shortage risk" ? "6 6" : undefined}
      />
      <text x={midX} y={midY - 4} className="fill-slate-400 text-[9px]">
        {edge.label}
      </text>
    </g>
  );
}

export function SupplyNetworkGraph() {
  const [filters, setFilters] = useState<SupplyNetworkFilters>(defaultSupplyNetworkFilters);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { snapshot } = useDemoInventoryState();

  const data = buildSupplyNetworkData(filters, snapshot);
  const laidOutNodes = buildNodeLayout(data.nodes);
  const nodeMap = new Map(laidOutNodes.map((node) => [node.id, node]));
  const activeSelectedNodeId =
    selectedNodeId && laidOutNodes.some((node) => node.id === selectedNodeId)
      ? selectedNodeId
      : laidOutNodes[0]?.id ?? null;
  const selectedNode = laidOutNodes.find((node) => node.id === activeSelectedNodeId) ?? null;
  const connectedIds = activeSelectedNodeId ? getConnectedNodeIds(activeSelectedNodeId, data.edges) : new Set<string>();
  const connectedNodes = selectedNode
    ? laidOutNodes.filter((node) => node.id !== selectedNode.id && connectedIds.has(node.id))
    : [];

  return (
    <div className="space-y-6">
      <GraphFilters
        filters={filters}
        options={data.options}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(defaultSupplyNetworkFilters)}
      />

      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <Card className="relative overflow-hidden border-white/60 bg-[#f8ffff] shadow-[0_28px_80px_-48px_rgba(14,116,144,0.65)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_38%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <CardHeader className="relative border-b border-white/60 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-teal-600 text-white hover:bg-teal-600">Supply network</Badge>
                  <DemoInventoryBadge />
                </div>
                <CardTitle className="flex items-center gap-3 text-slate-950">
                  <Network className="size-5 text-teal-700" />
                  Health Supply Knowledge Graph Explorer
                </CardTitle>
                <p className="max-w-2xl text-sm leading-7 text-slate-600">
                  This view links counties, facilities, essential medicines, demo stock
                  states, requests, and shortage signals to show how SDG 3 health access
                  can depend on clear supply visibility.
                </p>
              </div>
              <div className="grid min-w-56 gap-2 rounded-2xl border border-white/70 bg-white/75 p-3 text-sm text-slate-700 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <span>Facilities</span>
                  <span className="font-semibold text-slate-950">{data.summary.facilityCount}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Medicines</span>
                  <span className="font-semibold text-slate-950">{data.summary.medicineCount}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Requests</span>
                  <span className="font-semibold text-slate-950">{data.summary.requestCount}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Risk alerts</span>
                  <span className="font-semibold text-slate-950">{data.summary.riskCount}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative p-0">
            {laidOutNodes.length ? (
              <svg viewBox="0 0 1120 720" className="h-[720px] w-full">
                {columnOrder.map((kind) => (
                  <g key={kind}>
                    <text
                      x={columnX[kind]}
                      y={34}
                      textAnchor="middle"
                      className="fill-slate-400 text-[11px] font-semibold uppercase tracking-[0.24em]"
                    >
                      {kind}
                    </text>
                  </g>
                ))}
                {data.edges.map((edge) => {
                  const from = nodeMap.get(edge.from);
                  const to = nodeMap.get(edge.to);
                  if (!from || !to) return null;

                  const active =
                    !selectedNodeId || edge.from === selectedNodeId || edge.to === selectedNodeId;

                  return <EdgeLine key={edge.id} edge={edge} from={from} to={to} active={active} />;
                })}
                {laidOutNodes.map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    isSelected={activeSelectedNodeId === node.id}
                    isConnected={activeSelectedNodeId ? connectedIds.has(node.id) : true}
                    onClick={() => setSelectedNodeId(node.id)}
                  />
                ))}
              </svg>
            ) : (
              <div className="flex h-[520px] flex-col items-center justify-center gap-3 p-8 text-center text-slate-600">
                <CircleAlert className="size-10 text-amber-600" />
                <p className="max-w-md text-sm leading-7">
                  No nodes match the current filter combination. Reset the filters or
                  widen the stock and risk conditions to see more of the supply network.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <GraphNodeDetails node={selectedNode} connectedNodes={connectedNodes} edges={data.edges} />

          <Card className="border-white/60 bg-white/90 shadow-[0_20px_60px_-36px_rgba(14,116,144,0.5)]">
            <CardHeader>
              <CardTitle>How to read this graph</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
              <div className="flex items-start gap-3">
                <ShieldPlus className="mt-1 size-4 text-teal-700" />
                <p>Counties anchor the geography, facilities show local service points, and essential medicines reveal what each facility is currently modeled to stock.</p>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="mt-1 size-4 text-amber-600" />
                <p>Stock status and risk nodes explain where low stock or out-of-stock demo inventory can contribute to shortage pressure.</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRightLeft className="mt-1 size-4 text-sky-700" />
                <p>Request nodes add a simple citizen-demand lens so the network can show how access questions connect to supply constraints.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
