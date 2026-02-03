// import { useState, ChangeEvent, FormEvent, useEffect } from "react";
// import axios from "axios";

// interface FlightFormData {
//   airline: string;
//   source: string;
//   destination: string;
//   date_of_journey: string;
//   dep_time: string;
//   arrival_time: string;
//   duration: string;
//   total_stops: number;
//   additional_info: string;
// }

// interface PredictResponse {
//   predicted_price: number;
// }

// const API_URL = "http://127.0.0.1:8000/predict";

// const AIRLINES = [
//   "IndiGo",
//   "Air India",
//   "Jet Airways",
//   "SpiceJet",
//   "GoAir",
//   "Vistara",
//   "Air Asia",
//   "Trujet",
//   "Multiple carriers",
// ];

// const CITIES = [
//   "Delhi",
//   "Kolkata",
//   "Banglore",
//   "Cochin",
//   "Hyderabad",
//   "Chennai",
//   "Mumbai",
// ];

// const STOPS = [0, 1, 2, 3, 4];

// // Calculate Flight Duration
// function calculateDuration(dep: string, arr: string): string {
//   if (!dep || !arr) return "";

//   const [dh, dm] = dep.split(":").map(Number);
//   const [ah, am] = arr.split(":").map(Number);

//   let start = dh * 60 + dm;
//   let end = ah * 60 + am;
//   if (end < start) end += 24 * 60;

//   const diff = end - start;
//   return `${Math.floor(diff / 60)}h ${diff % 60}m`;
// }

// /* ---------- Component ---------- */
// export default function FlightForm() {
//   const [form, setForm] = useState<FlightFormData>({
//     airline: "",
//     source: "",
//     destination: "",
//     date_of_journey: "",
//     dep_time: "",
//     arrival_time: "",
//     duration: "",
//     total_stops: 0,
//     additional_info: "No Info",
//   });

//   const [price, setPrice] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setForm((p) => ({
//       ...p,
//       duration: calculateDuration(p.dep_time, p.arrival_time),
//     }));
//   }, [form.dep_time, form.arrival_time]);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((p) => ({
//       ...p,
//       [name]: name === "total_stops" ? Number(value) : value,
//     }));
//   };

//   const isValid =
//     form.airline &&
//     form.source &&
//     form.destination &&
//     form.source !== form.destination &&
//     form.date_of_journey &&
//     form.dep_time &&
//     form.arrival_time &&
//     form.duration;

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!isValid) return;

//     setLoading(true);
//     setError(null);
//     setPrice(null);

//     try {
//       const res = await axios.post<PredictResponse>(API_URL, form);
//       setPrice(res.data.predicted_price);
//     } catch (err: any) {
//       setError(err.response?.data?.detail || "Prediction failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-3xl">
//       {/* Card */}
//       <div className="rounded-lg border bg-background p-6 shadow-sm">
//         {/* Header */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold">Flight Fare Prediction</h2>
//           <p className="text-sm text-muted-foreground">
//             Estimate ticket price before booking
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//           <Select
//             label="Airline"
//             name="airline"
//             value={form.airline}
//             options={AIRLINES}
//             onChange={handleChange}
//           />

//           <Select
//             label="Source"
//             name="source"
//             value={form.source}
//             options={CITIES}
//             onChange={handleChange}
//           />

//           <Select
//             label="Destination"
//             name="destination"
//             value={form.destination}
//             options={CITIES.filter((c) => c !== form.source)}
//             onChange={handleChange}
//           />

//           <Input
//             label="Date of Journey"
//             type="date"
//             name="date_of_journey"
//             value={form.date_of_journey}
//             onChange={handleChange}
//           />

//           <Input
//             label="Departure Time"
//             type="time"
//             name="dep_time"
//             value={form.dep_time}
//             onChange={handleChange}
//           />

//           <Input
//             label="Arrival Time"
//             type="time"
//             name="arrival_time"
//             value={form.arrival_time}
//             onChange={handleChange}
//           />

//           <Input
//             label="Duration"
//             name="duration"
//             value={form.duration}
//             readOnly
//             disabled
//           />

//           <Select
//             label="Total Stops"
//             name="total_stops"
//             value={form.total_stops}
//             options={STOPS}
//             onChange={handleChange}
//           />

//           <div className="col-span-2 pt-2">
//             <button
//               type="submit"
//               disabled={!isValid || loading}
//               className="inline-flex h-9 w-full items-center justify-center rounded-md
//            bg-neutral-900 text-white
//            px-4 text-sm font-medium shadow
//            hover:bg-neutral-800
//            disabled:opacity-50">
//               {loading ? "Predicting…" : "Predict Price"}
//             </button>
//           </div>
//         </form>

//         {/* Error */}
//         {error && (
//           <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
//             {error}
//           </div>
//         )}

//         {/* Result */}
//         {price !== null && (
//           <div className="mt-6 rounded-md border bg-muted px-4 py-3">
//             <p className="text-sm text-muted-foreground">Predicted Fare</p>
//             <p className="text-2xl font-semibold">₹ {price.toFixed(2)}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------- Inputs ---------- */
// function Input({ label, readOnly = false, disabled = false, ...props }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-xs font-medium text-foreground">{label}</label>
//       <input
//         {...props}
//         readOnly={readOnly}
//         disabled={disabled}
//         className={`
//           h-9 rounded-md border px-3 text-sm
//           ${
//             disabled
//               ? "bg-muted text-muted-foreground cursor-not-allowed"
//               : "bg-background border-border focus:outline-none"
//           }
//         `}
//       />
//     </div>
//   );
// }

// function Select({ label, options, ...props }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-xs font-medium">{label}</label>
//       <select
//         {...props}
//         className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
//         <option value="">Select</option>
//         {options.map((opt: any) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
const API_URL = "http://127.0.0.1:8000/predict";

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

  /* Auto-calc duration */
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
      setError(err.response?.data?.detail || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-zinc-900">
            Flight Fare Predictor
          </h2>
          <p className="text-sm text-zinc-500">
            Estimate ticket price before booking
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Airline"
            name="airline"
            value={form.airline}
            options={AIRLINES}
            onChange={handleChange}
          />

          <Select
            label="Source"
            name="source"
            value={form.source}
            options={CITIES}
            onChange={handleChange}
          />

          <Select
            label="Destination"
            name="destination"
            value={form.destination}
            options={CITIES.filter((c) => c !== form.source)}
            onChange={handleChange}
          />

          <Input
            label="Date of Journey"
            type="date"
            name="date_of_journey"
            value={form.date_of_journey}
            onChange={handleChange}
          />

          <Input
            label="Departure Time"
            type="time"
            name="dep_time"
            value={form.dep_time}
            onChange={handleChange}
          />

          <Input
            label="Arrival Time"
            type="time"
            name="arrival_time"
            value={form.arrival_time}
            onChange={handleChange}
          />

          <Input
            label="Duration"
            name="duration"
            value={form.duration}
            disabled
          />

          <Select
            label="Total Stops"
            name="total_stops"
            value={form.total_stops}
            options={STOPS}
            onChange={handleChange}
          />

          {/* Submit */}
          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full rounded-md bg-zinc-900 py-2.5 text-sm font-medium
                         text-white shadow-sm
                         hover:bg-zinc-800 transition
                         disabled:opacity-50">
              {loading ? "Predicting..." : "Predict Price"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Result */}
        {price !== null && (
          <div className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-sm text-zinc-500">Predicted Fare</p>
            <p className="text-2xl font-semibold text-zinc-900">
              ₹ {price.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Inputs ---------- */
function Input({ label, disabled = false, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <input
        {...props}
        disabled={disabled}
        className={`h-9 rounded-md border px-3 text-sm ${
          disabled
            ? "bg-zinc-100 text-zinc-500 cursor-not-allowed border-zinc-200"
            : "bg-white border-zinc-300 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        }`}
      />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <select
        {...props}
        className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm
                   text-zinc-900
                   focus:outline-none focus:ring-2 focus:ring-zinc-400">
        <option value="">Select</option>
        {options.map((opt: any) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
