import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function BudgetsPage({ expenses, budgets, setBudgets, setModal }) {
  const monthExpenses = expenses.filter((e) => isThisMonth(e.date));
  const spentTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Budgets</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track spending against your monthly limits.</p>
        </div>
        <button
          onClick={() => setModal({ type: "budget" })}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2.5"
        >
          <Plus size={16} /> Create budget
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Total monthly budget</span>
          <span className="text-sm text-slate-500">{formatINR(spentTotal)} of {formatINR(totalLimit)}</span>
        </div>
        <ProgressBar pct={(spentTotal / totalLimit) * 100} tone={spentTotal > totalLimit ? "danger" : "accent"} />
      </div>

      {budgets.length === 0 ? (
        <EmptyState icon={PiggyBank} title="No budgets yet" body="Create your first budget to start tracking spending limits by category." actionLabel="Create budget" onAction={() => setModal({ type: "budget" })} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const spent = monthExpenses.filter((e) => e.category === b.category).reduce((s, e) => s + e.amount, 0);
            const pct = (spent / b.limit) * 100;
            const over = spent > b.limit;
            const tone = over ? "danger" : pct > 80 ? "warning" : "accent";
            return (
              <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: catColor(b.category) }} />
                    <span className="text-sm font-semibold text-slate-800">{catName(b.category)}</span>
                  </div>
                  {over ? <Badge tone="negative">Over budget</Badge> : pct > 80 ? <Badge tone="warning">Nearing limit</Badge> : <Badge tone="positive">On track</Badge>}
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-lg font-semibold text-slate-900">{formatINR(spent)}</span>
                  <span className="text-xs text-slate-400">of {formatINR(b.limit)}</span>
                </div>
                <ProgressBar pct={pct} tone={tone} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">{Math.round(pct)}% used</span>
                  <span className={`text-xs font-medium ${over ? "text-rose-600" : "text-slate-500"}`}>
                    {over ? `${formatINR(spent - b.limit)} over` : `${formatINR(b.limit - spent)} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BudgetForm({ onSave, onClose }) {
  const [category, setCategory] = useState("food");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (!limit || Number(limit) <= 0) { setError("Enter a valid budget amount."); return; }
    onSave({ id: `b-${Date.now()}`, category, limit: Number(limit) });
  };
  return (
    <div>
      <Field label="Category">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
          {mockCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Monthly limit">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
          <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className={`${inputCls} pl-7`} placeholder="5000" />
        </div>
      </Field>
      {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium py-2.5">Cancel</button>
        <button onClick={submit} className="flex-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5">Create budget</button>
      </div>
    </div>
  );
}

