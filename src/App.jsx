import React, { useState } from "react";
import { Plus, MessageSquareText, ChevronRight, Download } from "lucide-react";
import { TODAY, mockExpenses, mockBudgets, mockCreditCards, mockTrips, mockDetectedTransactions, mockSavingsGoals, mockInvestments } from "./data/mockData";
import { formatINR } from "./utils/format";
import { Modal, Field, inputCls } from "./components/ui";
import { NAV_ITEMS, Sidebar, MobileHeader, MobileDrawer, BottomNav } from "./components/Navigation";
import { ExpenseForm } from "./components/ExpenseForm";
import { Dashboard } from "./pages/Dashboard";
import { ExpensesPage } from "./pages/ExpensesPage";
import { BudgetsPage, BudgetForm } from "./pages/BudgetsPage";
import { CreditCardsPage, CardForm } from "./pages/CreditCardsPage";
import { SavingsPage } from "./pages/SavingsPage";
import { TripsPage, TripForm, TripExpenseForm } from "./pages/TripsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SmsPage, SmsDetectionSection } from "./pages/SmsPage";


export default function App() {
  const [active, setActive] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [budgets, setBudgets] = useState(mockBudgets);
  const [cards, setCards] = useState(mockCreditCards);
  const [trips, setTrips] = useState(mockTrips);
  const [detected, setDetected] = useState(mockDetectedTransactions);
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);

  const saveExpense = (exp) => {
    setExpenses((prev) => {
      const exists = prev.some((e) => e.id === exp.id);
      return exists ? prev.map((e) => (e.id === exp.id ? exp : e)) : [exp, ...prev];
    });
    if (modal?.fromDetected) setDetected((prev) => prev.filter((d) => d.id !== modal.fromDetected));
    closeModal();
  };

  const saveBudget = (b) => { setBudgets((prev) => [...prev, b]); closeModal(); };
  const saveCard = (c) => { setCards((prev) => [...prev, c]); closeModal(); };
  const saveTrip = (t) => { setTrips((prev) => [...prev, t]); closeModal(); };
  const saveTripExpense = (tripId, te) => {
    setTrips((prev) => prev.map((t) => t.id === tripId ? { ...t, expenses: [...t.expenses, te] } : t));
    closeModal();
  };

  const activeLabel = NAV_ITEMS.find((i) => i.id === active)?.label || "";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <Sidebar active={active} setActive={setActive} />
      {drawerOpen && <MobileDrawer active={active} setActive={setActive} onClose={() => setDrawerOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader activeLabel={activeLabel} onMenu={() => setDrawerOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6 max-w-6xl w-full mx-auto">
          {active === "dashboard" && (
            <div className="space-y-6">
              <Dashboard expenses={expenses} setModal={setModal} />
              {detected.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <MessageSquareText size={16} className="text-blue-600" /> Detected transactions
                    </h2>
                    <button onClick={() => setActive("sms")} className="text-xs font-medium text-blue-600 inline-flex items-center gap-1">
                      View all <ChevronRight size={13} />
                    </button>
                  </div>
                  <SmsDetectionSection detected={detected.slice(0, 2)} setDetected={setDetected} setModal={setModal} />
                </div>
              )}
            </div>
          )}
          {active === "expenses" && <ExpensesPage expenses={expenses} setExpenses={setExpenses} setModal={setModal} />}
          {active === "budgets" && <BudgetsPage expenses={expenses} budgets={budgets} setBudgets={setBudgets} setModal={setModal} />}
          {active === "cards" && <CreditCardsPage cards={cards} setModal={setModal} />}
          {active === "savings" && <SavingsPage goals={mockSavingsGoals} investments={mockInvestments} />}
          {active === "trips" && <TripsPage trips={trips} setTrips={setTrips} setModal={setModal} />}
          {active === "reports" && <ReportsPage expenses={expenses} setModal={setModal} />}
          {active === "settings" && <SettingsPage />}
          {active === "sms" && <SmsPage detected={detected} setDetected={setDetected} setModal={setModal} />}
        </main>
      </div>

      <BottomNav active={active} setActive={setActive} />

      {/* Floating add button for mobile */}
      <button
        onClick={() => setModal({ type: "expense" })}
        className="lg:hidden fixed bottom-20 right-4 z-30 w-13 h-13 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center"
        style={{ width: 52, height: 52 }}
      >
        <Plus size={22} />
      </button>

      {modal?.type === "expense" && (
        <Modal title={modal.initial ? "Edit expense" : "Add expense"} onClose={closeModal}>
          <ExpenseForm initial={modal.initial} onSave={saveExpense} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === "budget" && (
        <Modal title="Create budget" onClose={closeModal}>
          <BudgetForm onSave={saveBudget} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === "card" && (
        <Modal title="Add credit card" onClose={closeModal}>
          <CardForm onSave={saveCard} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === "payment" && (
        <Modal title={`Record payment — ${modal.card.bank} ${modal.card.name}`} onClose={closeModal}>
          <p className="text-sm text-slate-600 mb-4">
            Outstanding: <span className="font-semibold text-slate-900">{formatINR(modal.card.used)}</span>
          </p>
          <Field label="Payment amount">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
              <input type="number" defaultValue={modal.card.used} className={`${inputCls} pl-7`} />
            </div>
          </Field>
          <button
            onClick={() => {
              setCards((prev) => prev.map((c) => c.id === modal.card.id ? { ...c, used: 0, paymentStatus: "On track" } : c));
              closeModal();
            }}
            className="w-full rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5 mt-2"
          >
            Confirm payment
          </button>
        </Modal>
      )}
      {modal?.type === "trip" && (
        <Modal title="Create trip" onClose={closeModal}>
          <TripForm onSave={saveTrip} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === "tripExpense" && (
        <Modal title="Add trip expense" onClose={closeModal}>
          <TripExpenseForm trip={trips.find((t) => t.id === modal.tripId)} onSave={(te) => saveTripExpense(modal.tripId, te)} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === "export" && (
        <Modal title="Export report" onClose={closeModal}>
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Download size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-800">Coming soon</p>
            <p className="text-sm text-slate-500 mt-1">Export to PDF and XLSX will be available once the backend is connected.</p>
            <button onClick={closeModal} className="mt-4 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg px-4 py-2">Got it</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
