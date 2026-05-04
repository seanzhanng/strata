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

export interface HourRow {
  pickup_hour: number;
  trip_count: number;
  avg_fare: number;
  avg_tip: number;
}

export default function HourlyTripsChart({ data }: { data: HourRow[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold mb-4">Trips by Hour of Day</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pickup_hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="trip_count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}