import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function ExpensesPage({ expenses, setExpenses, setModal }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [method, setMethod] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const filtered = useMemo(() => {
    let list = expenses.filter((e) => {
      const matchesSearch = e.merchant.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === "all" || e.category === category;
      const matchesMethod = method === "all" || e.paymentMethod === method;
      return matchesSearch && matchesCat && matchesMethod;
    });
    list.sort((a, b) => {
      if (sortBy === "date-desc") return (a.date + a.time < b.date + b.time) ? 1 : -1;
      if (sortBy === "date-asc") return (a.date + a.time > b.date + b.time) ? 1 : -1;
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });
    return list;
  }, [expenses, search, category, method, sortBy]);

  const deleteExpense = (id) => setExpenses(expenses.filter((e) => e.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Expenses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} transactions</p>
        </div>
        <button
          onClick={() => setModal({ type: "expense" })}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2.5"
        >
          <Plus size={16} /> Add expense
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchant" className={`${inputCls} pl-9`}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} sm:w-40`}>
          <option value="all">All categories</option>
          {mockCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className={`${inputCls} sm:w-40`}>
          <option value="all">All methods</option>
          {paymentMethods.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${inputCls} sm:w-44`}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Amount: high to low</option>
          <option value="amount-asc">Amount: low to high</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt} title="No expenses found"
          body="Try adjusting your filters, or add a new expense to get started."
          actionLabel="Add expense" onAction={() => setModal({ type: "expense" })}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="hidden md:grid grid-cols-[100px_1.4fr_1fr_1fr_100px_80px] gap-3 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500 border-b border-slate-100">
            <span>Date</span><span>Merchant</span><span>Category</span><span>Payment</span><span className="text-right">Amount</span><span></span>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map((e) => (
              <div key={e.id} className="grid grid-cols-2 md:grid-cols-[100px_1.4fr_1fr_1fr_100px_80px] gap-2 md:gap-3 px-5 py-3.5 items-center">
                <span className="text-xs text-slate-500 md:text-sm">{dateLabel(e.date)}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{e.merchant}</p>
                  <p className="text-xs text-slate-400 truncate md:hidden">{catName(e.category)} · {e.paymentMethod}</p>
                </div>
                <span className="hidden md:block"><Badge>{catName(e.category)}</Badge></span>
                <span className="hidden md:block text-sm text-slate-500">{e.paymentMethod}</span>
                <span className="text-sm font-semibold text-slate-800 text-right col-span-1">{formatINR(e.amount)}</span>
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => setModal({ type: "expense", initial: e })} className="text-slate-400 hover:text-slate-700">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteExpense(e.id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

