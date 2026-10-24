import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";


export function SummaryCard({ label, value, sub, tone = "default", icon: Icon }) {
  const toneClasses = {
    default: "text-slate-900",
    positive: "text-emerald-700",
    negative: "text-rose-700",
    accent: "text-blue-700",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {Icon && <Icon size={16} className="text-slate-400" />}
      </div>
      <span className={`text-2xl font-semibold tracking-tight ${toneClasses[tone]}`}>{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}

export function ProgressBar({ pct, tone = "accent" }) {
  const tones = {
    accent: "bg-blue-600",
    warning: "bg-amber-500",
    danger: "bg-rose-600",
    positive: "bg-emerald-600",
  };
  return (
    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${tones[tone]} transition-all`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

export function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-600",
    positive: "bg-emerald-50 text-emerald-700",
    negative: "bg-rose-50 text-rose-700",
    warning: "bg-amber-50 text-amber-700",
    accent: "bg-blue-50 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, body, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-xl border border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
        <Icon size={22} className="text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">{body}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg px-4 py-2"
        >
          <Plus size={14} /> {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-xl border border-slate-200">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-3">
        <AlertTriangle size={22} className="text-rose-500" />
      </div>
      <p className="text-sm font-medium text-slate-800">Couldn't load this data</p>
      <p className="text-sm text-slate-500 mt-1">Check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-50"
      >
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4">
      <div className={`bg-white w-full ${wide ? "sm:max-w-lg" : "sm:max-w-md"} rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-slate-600 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

