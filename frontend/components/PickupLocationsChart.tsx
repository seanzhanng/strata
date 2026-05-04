"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface LocationRow {
  PULocationID: number;
  trip_count: number;
  avg_fare: number;
  total_revenue: number;
  avg_distance: number;
}

export default function PickupLocationsChart({ data }: { data: LocationRow[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold mb-4">Top 15 Pickup Locations</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="PULocationID" type="category" width={60} />
            <Tooltip />
            <Bar dataKey="trip_count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}