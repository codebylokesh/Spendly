import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function ExpenseForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || {
      amount: "", merchant: "", category: "food", date: toISODate(TODAY),
      time: "12:00", paymentMethod: "UPI", notes: "",
    }
  );
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.merchant.trim() || !form.amount || Number(form.amount) <= 0) {
      setError("Enter a merchant name and a valid amount.");
      return;
    }
    onSave({ ...form, amount: Number(form.amount), id: initial?.id || `exp-${Date.now()}` });
  };

  return (
    <div>
      <Field label="Amount">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
          <input
            type="number" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className={`${inputCls} pl-7`} placeholder="0"
          />
        </div>
      </Field>
      <Field label="Merchant">
        <input
          value={form.merchant}
          onChange={(e) => setForm({ ...form, merchant: e.target.value })}
          className={inputCls} placeholder="e.g. Swiggy"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {mockCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Payment method">
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className={inputCls}>
            {paymentMethods.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Time">
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputCls} />
        </Field>
      </div>
      <Field label="Notes (optional)">
        <textarea
          value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className={inputCls} rows={2} placeholder="Add a note"
        />
      </Field>
      {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium py-2.5">
          Cancel
        </button>
        <button onClick={submit} className="flex-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5">
          {initial ? "Save changes" : "Add expense"}
        </button>
      </div>
    </div>
  );
}

