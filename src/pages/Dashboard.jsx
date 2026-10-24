import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function Dashboard({ expenses, setModal }) {
  const monthExpenses = expenses.filter((e) => isThisMonth(e.date));
  const todaySpend = expenses.filter((e) => isToday(e.date)).reduce((s, e) => s + e.amount, 0);
  const monthSpend = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const remaining = totalMonthlyBudget - monthSpend;
  const savingsTotal = mockSavingsGoals.reduce((s, g) => s + g.current, 0);
  const totalBalance = 82450;

  const last14 = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(TODAY);
      d.setDate(d.getDate() - i);
      const iso = toISODate(d);
      const total = expenses.filter((e) => e.date === iso).reduce((s, e) => s + e.amount, 0);
      days.push({ label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), amount: total });
    }
    return days;
  }, [expenses]);

  const byCategory = useMemo(() => {
    return mockCategories
      .map((c) => ({
        name: c.name,
        value: monthExpenses.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0),
        color: c.color,
      }))
      .filter((c) => c.value > 0);
  }, [monthExpenses]);

  const byPayment = useMemo(() => {
    return paymentMethods
      .map((m) => ({ name: m, value: monthExpenses.filter((e) => e.paymentMethod === m).reduce((s, e) => s + e.amount, 0) }))
      .filter((m) => m.value > 0);
  }, [monthExpenses]);

  const budgetVsActual = mockBudgets.map((b) => ({
    name: catName(b.category).slice(0, 8),
    Budget: b.limit,
    Spent: monthExpenses.filter((e) => e.category === b.category).reduce((s, e) => s + e.amount, 0),
  }));

  const recent = [...expenses].sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Good evening, Rohan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your money.</p>
        </div>
        <button
          onClick={() => setModal({ type: "expense" })}
          className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2.5"
        >
          <Plus size={16} /> Add expense
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <SummaryCard label="Total balance" value={formatINR(totalBalance)} icon={Wallet} />
        <SummaryCard label="Today's spending" value={formatINR(todaySpend)} tone="negative" icon={Calendar} />
        <SummaryCard label="This month" value={formatINR(monthSpend)} tone="negative" icon={Receipt} />
        <SummaryCard label="Monthly budget" value={formatINR(totalMonthlyBudget)} icon={PiggyBank} />
        <SummaryCard
          label="Remaining budget"
          value={formatINR(remaining)}
          tone={remaining < 0 ? "negative" : "positive"}
          icon={IndianRupee}
        />
        <SummaryCard label="Savings" value={formatINR(savingsTotal)} tone="positive" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Spending over time</h2>
            <span className="text-xs text-slate-400">Last 14 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={last14} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F172A" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEF1F5" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="amount" stroke="#0F172A" strokeWidth={2} fill="url(#spendGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Category-wise spending</h2>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
                {byCategory.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
            {byCategory.slice(0, 6).map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Budget vs actual spending</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetVsActual} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#EEF1F5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Budget" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Spent" fill="#0F172A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Payment method breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byPayment} dataKey="value" nameKey="name" innerRadius={0} outerRadius={72} paddingAngle={2}>
                {byPayment.map((_, i) => (
                  <Cell key={i} fill={["#378ADD", "#7F77DD", "#D4537E", "#639922", "#BA7517"][i % 5]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-800">Recent transactions</h2>
          <span className="text-xs text-blue-600 font-medium">View all</span>
        </div>
        <div className="divide-y divide-slate-100">
          {recent.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ background: catColor(e.category) + "1A", color: catColor(e.category) }}
                >
                  {e.merchant.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{e.merchant}</p>
                  <p className="text-xs text-slate-400">{catName(e.category)} · {dateLabel(e.date)} · {e.paymentMethod}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800 shrink-0">-{formatINR(e.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

