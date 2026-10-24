import React, { useState, useMemo } from "react";
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, TrendingUp, Plane, BarChart3, Settings as SettingsIcon, Menu, X, Search, Plus, Filter, ArrowUpDown, Pencil, Trash2, ChevronDown, Wallet, Calendar, Smartphone, Bell, Lock, Fingerprint, Download, Upload, Moon, Sun, ShieldCheck, MessageSquareText, Check, EyeOff, AlertTriangle, ArrowRight, IndianRupee, Users, ReceiptText, ChevronRight, Landmark, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";


export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "budgets", label: "Budgets", icon: PiggyBank },
  { id: "cards", label: "Credit Cards", icon: CreditCard },
  { id: "savings", label: "Savings & Investments", icon: TrendingUp },
  { id: "trips", label: "Trips & Events", icon: "plane" },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export const MOBILE_TABS = ["dashboard", "expenses", "budgets", "cards", "reports"];

export function Sidebar({ active, setActive }) {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
          <IndianRupee size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 leading-tight">Paisa</p>
          <p className="text-[11px] text-slate-400 leading-tight">Expense Tracker</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
          RS
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-800 truncate">Rohan Sharma</p>
          <p className="text-[11px] text-slate-400">Data stored on device</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileHeader({ activeLabel, onMenu }) {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
          <IndianRupee size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-slate-900">{activeLabel}</span>
      </div>
      <button onClick={onMenu} className="text-slate-500">
        <Menu size={22} />
      </button>
    </div>
  );
}

export function MobileDrawer({ active, setActive, onClose }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-72 bg-white p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-900">Menu</span>
          <button onClick={onClose}><X size={20} className="text-slate-500" /></button>
        </div>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={17} /> {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function BottomNav({ active, setActive }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-1.5 z-30">
      {NAV_ITEMS.filter((i) => MOBILE_TABS.includes(i.id)).map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium ${
              isActive ? "text-slate-900" : "text-slate-400"
            }`}
          >
            <Icon size={19} />
            {item.label.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}

