"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface PaymentRow {
  payment_type: number;
  trip_count: number;
  avg_total: number;
  avg_tip: number;
}

const PAYMENT_LABELS: Record<number, string> = {
  1: "Credit Card",
  2: "Cash",
  3: "No Charge",
  4: "Dispute",
};

const PIE_COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444"];

export default function PaymentTypeChart({ data }: { data: PaymentRow[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold mb-4">Trips by Payment Type</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
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
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}