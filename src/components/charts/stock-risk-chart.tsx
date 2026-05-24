"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type StockRiskChartProps = {
  data: {
    name: string;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }[];
};

export function StockRiskChart({ data }: StockRiskChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis dataKey="name" stroke="#475569" tickLine={false} axisLine={false} />
          <YAxis stroke="#475569" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #bfdbfe",
              backgroundColor: "#f8fafc",
            }}
          />
          <Bar dataKey="inStock" stackId="stock" fill="#0f766e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="lowStock" stackId="stock" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          <Bar dataKey="outOfStock" stackId="stock" fill="#dc2626" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
