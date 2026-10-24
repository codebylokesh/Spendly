import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function CreditCardsPage({ cards, setModal }) {
  const [detail, setDetail] = useState(null);

  if (cards.length === 0) {
    return <EmptyState icon={CreditCard} title="No cards added" body="Add a credit card to track utilization, billing cycles, and dues." actionLabel="Add card" onAction={() => setModal({ type: "card" })} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Credit Cards</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor utilization and upcoming dues.</p>
        </div>
        <button onClick={() => setModal({ type: "card" })} className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2.5">
          <Plus size={16} /> Add card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((c) => {
          const util = (c.used / c.limit) * 100;
          const utilTone = util > 70 ? "danger" : util > 40 ? "warning" : "positive";
          return (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-5 text-white" style={{ background: c.color }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium opacity-90">{c.bank} {c.name}</span>
                  <span className="text-xs opacity-70">{c.network}</span>
                </div>
                <p className="text-lg tracking-widest opacity-90">•••• •••• •••• {c.last4}</p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Credit utilization</span>
                    <span className="text-xs font-medium text-slate-600">{Math.round(util)}%</span>
                  </div>
                  <ProgressBar pct={util} tone={utilTone} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-slate-400">Used</p>
                    <p className="text-sm font-semibold text-slate-800">{formatINR(c.used)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Available</p>
                    <p className="text-sm font-semibold text-slate-800">{formatINR(c.limit - c.used)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Limit</p>
                    <p className="text-sm font-semibold text-slate-800">{formatINR(c.limit)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <span>Billing: {c.billingDate}th</span>
                  <span>Due: {c.dueDate}th</span>
                  <Badge tone={c.paymentStatus === "On track" ? "positive" : "warning"}>{c.paymentStatus}</Badge>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setDetail(c)} className="flex-1 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg py-2">View details</button>
                  <button onClick={() => setModal({ type: "payment", card: c })} className="flex-1 text-xs font-medium bg-slate-900 text-white rounded-lg py-2">Record payment</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {detail && (
        <Modal title={`${detail.bank} ${detail.name}`} onClose={() => setDetail(null)}>
          <p className="text-xs text-slate-500 mb-3">Recent transactions</p>
          <div className="space-y-2.5">
            {detail.recent.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{t.merchant}</span>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{formatINR(t.amount)}</p>
                  <p className="text-xs text-slate-400">{dateLabel(t.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export function CardForm({ onSave, onClose }) {
  const [bank, setBank] = useState("");
  const [name, setName] = useState("");
  const [last4, setLast4] = useState("");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (!bank || !name || last4.length !== 4 || !limit) { setError("Fill all fields. Card ending must be 4 digits."); return; }
    onSave({
      id: `cc-${Date.now()}`, bank, name, last4, network: "Visa", limit: Number(limit),
      used: 0, billingDate: 5, dueDate: 20, color: "#3C3489",
      recent: [], paymentStatus: "On track",
    });
  };
  return (
    <div>
      <Field label="Bank name"><input value={bank} onChange={(e) => setBank(e.target.value)} className={inputCls} placeholder="e.g. ICICI Bank" /></Field>
      <Field label="Card name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Amazon Pay" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Last 4 digits"><input value={last4} maxLength={4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))} className={inputCls} placeholder="1234" /></Field>
        <Field label="Credit limit"><input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className={inputCls} placeholder="100000" /></Field>
      </div>
      <p className="text-xs text-slate-400 mb-3">Full card numbers and CVV are never collected or stored.</p>
      {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium py-2.5">Cancel</button>
        <button onClick={submit} className="flex-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5">Add card</button>
      </div>
    </div>
  );
}

