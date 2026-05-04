"use client";

import { useEffect, useState } from "react";
import DailyTripsChart, { DateRow } from "../components/DailyTripsChart";
import HourlyTripsChart, { HourRow } from "../components/HourlyTripsChart";
import PaymentTypeChart, { PaymentRow } from "../components/PaymentTypeChart";
import PickupLocationsChart, { LocationRow } from "../components/PickupLocationsChart";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      <DailyTripsChart data={dateData} />
      <HourlyTripsChart data={hourData} />
      <PaymentTypeChart data={paymentData} />
      <PickupLocationsChart data={locationData} />
    </main>
  );
}