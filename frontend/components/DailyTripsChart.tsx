"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface DateRow {
  pickup_date: string;
  trip_count: number;
  avg_fare: number;
  total_revenue: number;
  avg_distance: number;
}

export default function DailyTripsChart({ data }: { data: DateRow[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold mb-4">Daily Trips — January 2026</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="pickup_date"
              tickFormatter={(val) => new Date(val).getDate().toString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(val) =>
                new Date(val).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <Line
              type="monotone"
              dataKey="trip_count"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}