import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";

const goalIcons = { shield: ShieldCheck, wallet: Wallet, plane: Plane };


export function SavingsPage({ goals, investments }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Savings & Investments</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track progress toward your goals and portfolio.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Savings goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((g) => {
            const Icon = goalIcons[g.icon] || Wallet;
            const pct = (g.current / g.target) * 100;
            return (
              <div key={g.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon size={17} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{g.name}</span>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-lg font-semibold text-slate-900">{formatINR(g.current)}</span>
                  <span className="text-xs text-slate-400">of {formatINR(g.target)}</span>
                </div>
                <ProgressBar pct={pct} tone="positive" />
                <span className="text-xs text-slate-400 mt-2 inline-block">{Math.round(pct)}% complete</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Investments</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500 border-b border-slate-100">
            <span>Name</span><span>Type</span><span>Invested</span><span>Current value</span><span>Gain / loss</span>
          </div>
          <div className="divide-y divide-slate-100">
            {investments.map((inv) => {
              const gain = inv.current - inv.invested;
              const gainPct = (gain / inv.invested) * 100;
              return (
                <div key={inv.id} className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-4 items-center">
                  <span className="text-sm font-medium text-slate-800 col-span-2 md:col-span-1">{inv.name}</span>
                  <Badge>{inv.type}</Badge>
                  <span className="hidden md:block text-sm text-slate-600">{formatINR(inv.invested)}</span>
                  <span className="hidden md:block text-sm text-slate-600">{formatINR(inv.current)}</span>
                  <span className={`text-sm font-semibold ${gain >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {gain >= 0 ? "+" : ""}{formatINR(gain)} ({gainPct.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

