import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function computeSettlement(trip) {
  const perHead = trip.expenses.reduce((s, e) => s + e.amount, 0) / trip.members.length;
  const paidByMember = Object.fromEntries(trip.members.map((m) => [m, 0]));
  trip.expenses.forEach((e) => { paidByMember[e.paidBy] = (paidByMember[e.paidBy] || 0) + e.amount; });
  return trip.members.map((m) => ({ member: m, net: paidByMember[m] - perHead }));
}

export function TripsPage({ trips, setTrips, setModal }) {
  const [activeTrip, setActiveTrip] = useState(trips[0]?.id);
  const trip = trips.find((t) => t.id === activeTrip);

  if (trips.length === 0) {
    return <EmptyState icon={Plane} title="No trips yet" body="Create a trip to split expenses and track settlements with friends." actionLabel="Add trip" onAction={() => setModal({ type: "trip" })} />;
  }

  const settlement = trip ? computeSettlement(trip) : [];
  const total = trip ? trip.expenses.reduce((s, e) => s + e.amount, 0) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Trips & Events</h1>
          <p className="text-sm text-slate-500 mt-0.5">Split group expenses and settle up easily.</p>
        </div>
        <button onClick={() => setModal({ type: "trip" })} className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2.5">
          <Plus size={16} /> New trip
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {trips.map((t) => (
          <button
            key={t.id} onClick={() => setActiveTrip(t.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium border ${
              activeTrip === t.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {trip && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">{trip.name}</h2>
              <span className="text-xs text-slate-400">{trip.dateRange}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 mb-4">
              <Users size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500">{trip.members.join(", ")}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">{formatINR(total)}</span>
              <span className="text-xs text-slate-400">total spent · {formatINR(total / trip.members.length)} per person</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Expenses</h3>
                <button
                  onClick={() => setModal({ type: "tripExpense", tripId: trip.id })}
                  className="text-xs font-medium text-blue-600 inline-flex items-center gap-1"
                >
                  <Plus size={13} /> Add expense
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {trip.expenses.map((e) => (
                  <div key={e.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <ReceiptText size={15} className="text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-800">{e.label}</p>
                        <p className="text-xs text-slate-400">Paid by {e.paidBy}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-800">{formatINR(e.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Settlement summary</h3>
              <div className="space-y-2.5">
                {settlement.map((s) => (
                  <div key={s.member} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{s.member}</span>
                    {s.net > 1 ? (
                      <Badge tone="positive">Receives {formatINR(s.net)}</Badge>
                    ) : s.net < -1 ? (
                      <Badge tone="negative">Owes {formatINR(Math.abs(s.net))}</Badge>
                    ) : (
                      <Badge>Settled up</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function TripForm({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState("You");
  const [error, setError] = useState("");
  const submit = () => {
    const list = members.split(",").map((m) => m.trim()).filter(Boolean);
    if (!name || list.length < 2) { setError("Enter a trip name and at least 2 members."); return; }
    onSave({ id: `t-${Date.now()}`, name, dateRange: "TBD", members: list, expenses: [] });
  };
  return (
    <div>
      <Field label="Trip name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Manali Trip" /></Field>
      <Field label="Members (comma separated)"><input value={members} onChange={(e) => setMembers(e.target.value)} className={inputCls} placeholder="You, Arun, Karthik" /></Field>
      {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium py-2.5">Cancel</button>
        <button onClick={submit} className="flex-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5">Create trip</button>
      </div>
    </div>
  );
}

export function TripExpenseForm({ trip, onSave, onClose }) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(trip.members[0]);
  const [error, setError] = useState("");
  const submit = () => {
    if (!label || !amount || Number(amount) <= 0) { setError("Enter a label and valid amount."); return; }
    onSave({ id: `te-${Date.now()}`, label, amount: Number(amount), paidBy });
  };
  return (
    <div>
      <Field label="Expense label"><input value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} placeholder="e.g. Breakfast" /></Field>
      <Field label="Amount">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputCls} pl-7`} placeholder="0" />
        </div>
      </Field>
      <Field label="Paid by">
        <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className={inputCls}>
          {trip.members.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Field>
      {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium py-2.5">Cancel</button>
        <button onClick={submit} className="flex-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5">Add expense</button>
      </div>
    </div>
  );
}

