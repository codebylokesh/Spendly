import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TODAY, toISODate, mockCategories, catColor, catName, paymentMethods, mockExpenses, mockDetectedTransactions, mockBudgets, totalMonthlyBudget, mockCreditCards, mockSavingsGoals, mockInvestments, mockTrips } from "../data/mockData";
import { formatINR, dateLabel, monthKey, isThisMonth, isToday } from "../utils/format";
import { SummaryCard, ProgressBar, Badge, EmptyState, LoadingState, ErrorState, Modal, Field, inputCls } from "../components/ui";


export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${checked ? "bg-slate-900" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-4.5 left-0.5" : "left-0.5"}`}
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }} />
    </button>
  );
}

export function SettingsRow({ icon: Icon, title, sub, right }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-slate-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800">{title}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [dailyReminder, setDailyReminder] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [cardReminders, setCardReminders] = useState(false);
  const [appLock, setAppLock] = useState(false);
  const [biometric, setBiometric] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage app preferences and security.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Appearance</h2>
        <div className="divide-y divide-slate-100">
          <SettingsRow
            icon={theme === "light" ? Sun : Moon} title="Theme" sub="Choose how Paisa looks on your device"
            right={
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button onClick={() => setTheme("light")} className={`px-3 py-1 text-xs font-medium rounded-md ${theme === "light" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>Light</button>
                <button onClick={() => setTheme("dark")} className={`px-3 py-1 text-xs font-medium rounded-md ${theme === "dark" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>Dark</button>
              </div>
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Notifications</h2>
        <div className="divide-y divide-slate-100">
          <SettingsRow icon={Bell} title="Daily expense reminder" sub="A nudge every evening to log expenses" right={<Toggle checked={dailyReminder} onChange={setDailyReminder} />} />
          <SettingsRow icon={PiggyBank} title="Budget alerts" sub="Notify when nearing a category limit" right={<Toggle checked={budgetAlerts} onChange={setBudgetAlerts} />} />
          <SettingsRow icon={CreditCard} title="Credit card payment reminders" sub="Alerts before your due date" right={<Toggle checked={cardReminders} onChange={setCardReminders} />} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Security</h2>
        <div className="divide-y divide-slate-100">
          <SettingsRow icon={Lock} title="App lock" sub="Require a passcode to open Paisa" right={<Toggle checked={appLock} onChange={setAppLock} />} />
          <SettingsRow icon={Fingerprint} title="Biometric authentication" sub="Unlock with fingerprint or face ID" right={<Toggle checked={biometric} onChange={setBiometric} />} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Data</h2>
        <div className="divide-y divide-slate-100">
          <SettingsRow icon={Upload} title="Backup data" sub="Save a local copy of your data" right={<button className="text-xs font-medium text-blue-600">Backup</button>} />
          <SettingsRow icon={Download} title="Restore data" sub="Restore from a previous backup" right={<button className="text-xs font-medium text-blue-600">Restore</button>} />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Your financial data stays on your device. Paisa does not upload transactions or account details to any server without your consent.
        </p>
      </div>
    </div>
  );
}

