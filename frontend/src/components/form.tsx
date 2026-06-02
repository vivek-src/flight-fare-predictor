import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

/* ---------- Types ---------- */
interface FlightFormData {
  airline: string;
  source: string;
  destination: string;
  date_of_journey: string;
  dep_time: string;
  arrival_time: string;
  duration: string;
  total_stops: number;
  additional_info: string;
}

interface PredictResponse {
  predicted_price: number;
}

/* ---------- Constants ---------- */
const API_URL = "http://127.0.0.1:8001/predict";

const AIRLINES = [
  "IndiGo",
  "Air India",
  "Jet Airways",
  "SpiceJet",
  "GoAir",
  "Vistara",
  "Air Asia",
  "Trujet",
  "Multiple carriers",
];

const AIRLINE_COLORS: Record<string, string> = {
  IndiGo: "#3f51b5",
  "Air India": "#e53935",
  "Jet Airways": "#1a237e",
  SpiceJet: "#f57c00",
  GoAir: "#2e7d32",
  Vistara: "#6a1b9a",
  "Air Asia": "#c62828",
  Trujet: "#ef6c00",
  "Multiple carriers": "#607d8b",
};

const CITIES = [
  "Delhi",
  "Kolkata",
  "Banglore",
  "Cochin",
  "Hyderabad",
  "Chennai",
  "Mumbai",
];

const STOPS = [0, 1, 2, 3, 4];

/* ---------- Duration Logic ---------- */
function calculateDuration(dep: string, arr: string): string {
  if (!dep || !arr) return "";
  const [dh, dm] = dep.split(":").map(Number);
  const [ah, am] = arr.split(":").map(Number);
  let start = dh * 60 + dm;
  let end = ah * 60 + am;
  if (end < start) end += 24 * 60;
  const diff = end - start;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
}

/* ---------- Component ---------- */
export default function FlightForm() {
  const [form, setForm] = useState<FlightFormData>({
    airline: "",
    source: "",
    destination: "",
    date_of_journey: "",
    dep_time: "",
    arrival_time: "",
    duration: "",
    total_stops: 0,
    additional_info: "No Info",
  });

  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm((p) => ({
      ...p,
      duration: calculateDuration(p.dep_time, p.arrival_time),
    }));
  }, [form.dep_time, form.arrival_time]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "total_stops" ? Number(value) : value,
    }));
  };

  const isValid =
    form.airline &&
    form.source &&
    form.destination &&
    form.source !== form.destination &&
    form.date_of_journey &&
    form.dep_time &&
    form.arrival_time &&
    form.duration;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError(null);
    setPrice(null);
    try {
      const res = await axios.post<PredictResponse>(API_URL, form);
      setPrice(res.data.predicted_price);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Oops! Prediction server is sleeping.",
      );
    } finally {
      setLoading(false);
    }
  };

  const airlineColor = AIRLINE_COLORS[form.airline] || "#6c5ce7";

  return (
    <div className="flex flex-col gap-12">
      {/* Dynamic Boarding Pass Element */}
      <section className="clay-card p-0 flex flex-col md:flex-row overflow-hidden min-h-[280px]">
        {/* Main Part */}
        <div className="flex-1 p-10 flex flex-col justify-between gap-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Airline
              </span>
              <h2
                className="text-2xl font-black"
                style={{ color: airlineColor }}>
                {form.airline || "SELECT AIRLINE"}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Class
              </span>
              <h2 className="text-xl font-black text-[#2d3436]">ECONOMY</h2>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                From
              </span>
              <h3 className="text-5xl font-black text-[#2d3436]">
                {form.source || "---"}
              </h3>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <div className="w-full h-[2px] bg-gray-200 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xl">
                  ✈️
                </div>
              </div>
              <span className="text-[8px] font-bold text-gray-400 uppercase mt-2">
                {form.duration || "NON-STOP"}
              </span>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                To
              </span>
              <h3 className="text-5xl font-black text-[#2d3436]">
                {form.destination || "---"}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t-2 border-gray-100 pt-6">
            <div>
              <span className="text-[8px] font-black text-gray-400 uppercase">
                Date
              </span>
              <p className="font-bold text-[#2d3436]">
                {form.date_of_journey || "--/--/--"}
              </p>
            </div>
            <div>
              <span className="text-[8px] font-black text-gray-400 uppercase">
                Departure
              </span>
              <p className="font-bold text-[#2d3436]">
                {form.dep_time || "00:00"}
              </p>
            </div>
            <div>
              <span className="text-[8px] font-black text-gray-400 uppercase">
                Arrival
              </span>
              <p className="font-bold text-[#2d3436]">
                {form.arrival_time || "00:00"}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="ticket-divider hidden md:block"></div>

        {/* Stub Part */}
        <div className="w-full md:w-72 p-10 bg-gray-50 flex flex-col justify-between border-t md:border-t-0 border-gray-100">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Stops
              </span>
              <p className="text-2xl font-black text-[#2d3436]">
                {form.total_stops} STOP{form.total_stops !== 1 ? "S" : ""}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Passenger
              </span>
              <p className="font-bold text-[#2d3436]">GUEST USER</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="barcode h-16 w-full opacity-30"></div>
            {price !== null && (
              <div className="text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Final Price
                </span>
                <p
                  className="text-4xl font-black"
                  style={{ color: airlineColor }}>
                  ₹{price.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Groups */}
        <section className="clay-card p-10 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 clay-btn flex items-center justify-center text-xl">
              ✈️
            </div>
            <h3 className="text-xl font-black text-[#2d3436]">Booking Info</h3>
          </div>

          <Select
            label="Which Airline?"
            name="airline"
            value={form.airline}
            options={AIRLINES}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-6">
            <Select
              label="From"
              name="source"
              value={form.source}
              options={CITIES}
              onChange={handleChange}
            />
            <Select
              label="To"
              name="destination"
              value={form.destination}
              options={CITIES.filter((c) => c !== form.source)}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="clay-card p-10 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 clay-btn flex items-center justify-center text-xl">
              📅
            </div>
            <h3 className="text-xl font-black text-[#2d3436]">Timeline</h3>
          </div>

          <Input
            label="Date"
            type="date"
            name="date_of_journey"
            value={form.date_of_journey}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Departure"
              type="time"
              name="dep_time"
              value={form.dep_time}
              onChange={handleChange}
            />
            <Input
              label="Arrival"
              type="time"
              name="arrival_time"
              value={form.arrival_time}
              onChange={handleChange}
            />
          </div>

          <Select
            label="Total Stops"
            name="total_stops"
            value={form.total_stops}
            options={STOPS}
            onChange={handleChange}
          />
        </section>

        {/* Prediction Trigger */}
        <div className="lg:col-span-2 flex justify-center py-6">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="clay-btn px-20 py-6 text-xl tracking-wide uppercase disabled:opacity-50"
            style={{ backgroundColor: isValid ? airlineColor : "#6c5ce7" }}>
            {loading ? "Calculating..." : "Generate Prediction"}
          </button>
        </div>
      </form>

      {/* Simplified Results Card */}
      {price !== null && !error && (
        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-[#636e72] font-bold">
            Prediction generated successfully! Check your boarding pass stub
            above. 🎫
          </p>
        </div>
      )}

      {error && (
        <div className="clay-card p-6 max-w-md mx-auto w-full text-center border-2 border-red-100">
          <p className="text-red-500 font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Sub-components ---------- */
function Input({ label, isSelect = false, options, ...props }: any) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-black text-[#636e72] uppercase ml-2 tracking-widest">
        {label}
      </label>
      {isSelect ? (
        <select
          {...props}
          className="clay-input px-6 py-4 text-base font-bold text-[#2d3436] w-full cursor-pointer">
          {options.map((opt: any) => (
            <option key={opt} value={opt}>
              {opt} Stop{opt !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...props}
          className="clay-input px-6 py-4 text-base font-bold text-[#2d3436] w-full"
        />
      )}
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-black text-[#636e72] uppercase ml-2 tracking-widest">
        {label}
      </label>
      <select
        {...props}
        className="clay-input px-6 py-4 text-base font-bold text-[#2d3436] w-full cursor-pointer appearance-none">
        <option value="">Select Option...</option>
        {options.map((opt: any) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
