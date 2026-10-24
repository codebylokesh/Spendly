import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function ReportsPage({ expenses, setModal }) {
  const monthExpenses = expenses.filter((e) => isThisMonth(e.date));
  const totalSpend = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const daysElapsed = new Date(TODAY).getDate();
  const avgDaily = totalSpend / daysElapsed;

  const byCategory = mockCategories
    .map((c) => ({ name: c.name, value: monthExpenses.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0) }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const topCategory = byCategory[0];

  const byPayment = paymentMethods
    .map((m) => ({ name: m, value: monthExpenses.filter((e) => e.paymentMethod === m).reduce((s, e) => s + e.amount, 0) }))
    .filter((m) => m.value > 0);

  const weeklyTrend = useMemo(() => {
    const weeks = [0, 0, 0, 0];
    monthExpenses.forEach((e) => {
      const day = new Date(e.date + "T00:00:00").getDate();
      const w = Math.min(3, Math.floor((day - 1) / 7));
      weeks[w] += e.amount;
    });
    return weeks.map((v, i) => ({ label: `Week ${i + 1}`, value: v }));
  }, [monthExpenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">August 2026 summary</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ type: "export" })} className="text-sm font-medium border border-slate-300 text-slate-700 rounded-lg px-3.5 py-2 inline-flex items-center gap-1.5">
            <Download size={14} /> Export PDF
          </button>
          <button onClick={() => setModal({ type: "export" })} className="text-sm font-medium border border-slate-300 text-slate-700 rounded-lg px-3.5 py-2 inline-flex items-center gap-1.5">
            <Download size={14} /> Export XLSX
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Monthly spending" value={formatINR(totalSpend)} icon={Receipt} />
        <SummaryCard label="Average daily spend" value={formatINR(avgDaily)} icon={Calendar} />
        <SummaryCard label="Top category" value={topCategory?.name || "—"} sub={topCategory ? formatINR(topCategory.value) : ""} icon={BarChart3} />
        <SummaryCard label="Transactions" value={monthExpenses.length} icon={ReceiptText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Weekly spending trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyTrend} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#EEF1F5" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" fill="#0F172A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Category analysis</h2>
          <div className="space-y-3">
            {byCategory.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-slate-600 font-medium">{c.name}</span>
                  <span className="text-slate-400">{formatINR(c.value)}</span>
                </div>
                <ProgressBar pct={(c.value / byCategory[0].value) * 100} tone="accent" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Payment method analysis</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byPayment} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid horizontal={false} stroke="#EEF1F5" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} width={90} />
            <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="value" fill="#378ADD" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

