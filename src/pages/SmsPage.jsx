import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function SmsDetectionSection({ detected, setDetected, setModal }) {
  const act = (id, action) => setDetected(detected.filter((d) => d.id !== id));

  if (detected.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="No new transactions detected"
        body="When SMS-based detection is enabled, new bank transactions will appear here automatically for review."
      />
    );
  }

  return (
    <div className="space-y-3">
      {detected.map((d) => (
        <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Smartphone size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">New transaction detected</p>
                <p className="text-xs text-slate-400">{d.bank}{d.cardTail ? ` · •••• ${d.cardTail}` : ""} · {d.detectedAt}</p>
              </div>
            </div>
            <span className="text-base font-semibold text-slate-900">{formatINR(d.amount)}</span>
          </div>
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
            <span className="font-medium">{d.merchant}</span>
            <span className="text-slate-300">·</span>
            <Badge>{catName(d.category)}</Badge>
          </div>
          <div className="flex gap-2">
            <button onClick={() => act(d.id, "confirm")} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg py-2">
              <Check size={13} /> Confirm
            </button>
            <button onClick={() => setModal({ type: "expense", initial: { amount: d.amount, merchant: d.merchant, category: d.category, date: toISODate(TODAY), time: "12:00", paymentMethod: "UPI", notes: "" }, fromDetected: d.id })} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg py-2">
              <Pencil size={13} /> Edit
            </button>
            <button onClick={() => act(d.id, "ignore")} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 rounded-lg py-2">
              <EyeOff size={13} /> Ignore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SmsPage({ detected, setDetected, setModal }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Detected transactions</h1>
        <p className="text-sm text-slate-500 mt-0.5">Prototype of automatic SMS-based transaction detection — not yet reading real messages.</p>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={17} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          This is a UI prototype using sample data to demonstrate the intended workflow. Real SMS reading is not implemented in this build.
        </p>
      </div>
      <SmsDetectionSection detected={detected} setDetected={setDetected} setModal={setModal} />
    </div>
  );
}

