"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DateRow {
  pickup_date: string;
  trip_count: number;
  avg_fare: number;
  total_revenue: number;
  avg_distance: number;
}

interface HourRow {
  pickup_hour: number;
  trip_count: number;
  avg_fare: number;
  avg_tip: number;
}

interface PaymentRow {
  payment_type: number;
  trip_count: number;
  avg_total: number;
  avg_tip: number;
}

interface LocationRow {
  PULocationID: number;
  trip_count: number;
  avg_fare: number;
  total_revenue: number;
  avg_distance: number;
}

const PAYMENT_LABELS: Record<number, string> = {
  1: "Credit Card",
  2: "Cash",
  3: "No Charge",
  4: "Dispute",
};

const PIE_COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444"];

export default function Dashboard() {
  const [dateData, setDateData] = useState<DateRow[]>([]);
  const [hourData, setHourData] = useState<HourRow[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentRow[]>([]);
  const [locationData, setLocationData] = useState<LocationRow[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/gold/date`)
      .then((res) => res.json())
      .then((data) =>
        setDateData([...data].sort((a: DateRow, b: DateRow) => a.pickup_date.localeCompare(b.pickup_date)))
      );

    fetch(`${API_URL}/api/gold/hour`)
      .then((res) => res.json())
      .then((data) =>
        setHourData([...data].sort((a: HourRow, b: HourRow) => a.pickup_hour - b.pickup_hour))
      );

    fetch(`${API_URL}/api/gold/payment_type`)
      .then((res) => res.json())
      .then((data) => setPaymentData(data));

    fetch(`${API_URL}/api/gold/pickup_location`)
      .then((res) => res.json())
      .then((data) =>
        setLocationData(
          [...data].sort((a: LocationRow, b: LocationRow) => b.trip_count - a.trip_count).slice(0, 15)
        )
      );
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8">Strata</h1>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Daily Trips — January 2026</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dateData}>
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

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Trips by Hour of Day</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pickup_hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trip_count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Trips by Payment Type</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="trip_count"
                nameKey="payment_type"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(props: { payment_type?: number; percent?: number }) => {
                  const name = PAYMENT_LABELS[props.payment_type ?? 0] || props.payment_type;
                  return `${name} (${((props.percent ?? 0) * 100).toFixed(1)}%)`;
                }}
              >
                {paymentData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Top 15 Pickup Locations</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="PULocationID" type="category" width={60} />
              <Tooltip />
              <Bar dataKey="trip_count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}