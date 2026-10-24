/* Mock data layer — replace these exports with API calls when the backend is ready. */


export const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const TODAY = new Date("2026-08-30T20:00:00");

export const mockCategories = [
  { id: "food", name: "Food", color: "#D85A30" },
  { id: "transport", name: "Transport", color: "#378ADD" },
  { id: "shopping", name: "Shopping", color: "#7F77DD" },
  { id: "entertainment", name: "Entertainment", color: "#D4537E" },
  { id: "bills", name: "Bills", color: "#BA7517" },
  { id: "groceries", name: "Groceries", color: "#639922" },
  { id: "health", name: "Health", color: "#1D9E75" },
  { id: "others", name: "Others", color: "#888780" },
];

export const catColor = (id) => mockCategories.find((c) => c.id === id)?.color || "#888780";
export const catName = (id) => mockCategories.find((c) => c.id === id)?.name || "Others";

export const paymentMethods = ["UPI", "Credit Card", "Debit Card", "Cash", "Net Banking"];

let expenseSeq = 1;
const mkExpense = (daysAgo, hh, mm, merchant, category, method, amount, notes = "") => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hh, mm, 0, 0);
  return {
    id: `exp-${expenseSeq++}`,
    date: toISODate(d),
    time: d.toTimeString().slice(0, 5),
    merchant,
    category,
    paymentMethod: method,
    amount,
    notes,
  };
};

export const mockExpenses = [
  mkExpense(0, 20, 15, "Swiggy", "food", "UPI", 420, "Dinner with roommates"),
  mkExpense(0, 13, 40, "Uber", "transport", "UPI", 280, "Office commute"),
  mkExpense(0, 9, 5, "Chaicup", "food", "Cash", 60),
  mkExpense(1, 19, 30, "Amazon", "shopping", "Credit Card", 1299, "Phone case"),
  mkExpense(1, 12, 0, "Netflix", "entertainment", "Credit Card", 649, "Monthly subscription"),
  mkExpense(2, 18, 10, "Electricity Bill", "bills", "Net Banking", 2450),
  mkExpense(2, 9, 45, "BigBasket", "groceries", "UPI", 1840, "Weekly groceries"),
  mkExpense(3, 21, 0, "Zomato", "food", "UPI", 560),
  mkExpense(3, 8, 30, "Ola", "transport", "UPI", 190),
  mkExpense(4, 17, 20, "PVR Cinemas", "entertainment", "Debit Card", 900, "Movie with friends"),
  mkExpense(4, 11, 0, "Apollo Pharmacy", "health", "UPI", 340),
  mkExpense(5, 20, 45, "Domino's", "food", "UPI", 510),
  mkExpense(5, 10, 15, "Myntra", "shopping", "Credit Card", 2199, "Festive sale"),
  mkExpense(6, 19, 0, "Airtel Postpaid", "bills", "UPI", 599),
  mkExpense(6, 8, 0, "Metro Card Recharge", "transport", "UPI", 500),
  mkExpense(7, 13, 30, "Starbucks", "food", "Credit Card", 480),
  mkExpense(8, 20, 0, "More Supermarket", "groceries", "Debit Card", 1360),
  mkExpense(9, 22, 10, "Spotify", "entertainment", "Credit Card", 119),
  mkExpense(9, 12, 30, "Ola", "transport", "UPI", 210),
  mkExpense(10, 14, 0, "Reliance Trends", "shopping", "Credit Card", 1850),
  mkExpense(11, 19, 45, "Swiggy", "food", "UPI", 375),
  mkExpense(12, 9, 0, "Practo Consultation", "health", "UPI", 700),
  mkExpense(13, 18, 30, "Gas Cylinder", "bills", "Cash", 1100),
  mkExpense(14, 20, 20, "Barbeque Nation", "food", "Credit Card", 2450, "Birthday dinner"),
  mkExpense(15, 10, 0, "Croma", "shopping", "Credit Card", 3499, "Wireless earbuds"),
  mkExpense(16, 12, 0, "Uber", "transport", "UPI", 340),
  mkExpense(17, 21, 0, "Water Bill", "bills", "Net Banking", 420),
  mkExpense(18, 9, 30, "DMart", "groceries", "Debit Card", 2100),
  mkExpense(19, 20, 0, "BookMyShow", "entertainment", "UPI", 700, "Concert tickets"),
  mkExpense(21, 13, 0, "Cult.fit Membership", "health", "Credit Card", 1499),
];

export const mockDetectedTransactions = [
  { id: "det-1", bank: "HDFC Bank", amount: 850, merchant: "Swiggy", category: "food", detectedAt: "Today, 7:42 PM", cardTail: "4521" },
  { id: "det-2", bank: "SBI", amount: 1499, merchant: "Amazon", category: "shopping", detectedAt: "Today, 3:10 PM", cardTail: "7824" },
  { id: "det-3", bank: "ICICI Bank", amount: 220, merchant: "Ola", category: "transport", detectedAt: "Yesterday, 9:05 AM", cardTail: null },
];

export const mockBudgets = [
  { id: "b1", category: "food", limit: 6000 },
  { id: "b2", category: "transport", limit: 4000 },
  { id: "b3", category: "shopping", limit: 5000 },
  { id: "b4", category: "entertainment", limit: 3000 },
  { id: "b5", category: "bills", limit: 5000 },
  { id: "b6", category: "groceries", limit: 6000 },
  { id: "b7", category: "health", limit: 2500 },
];
export const totalMonthlyBudget = mockBudgets.reduce((s, b) => s + b.limit, 0);

export const mockCreditCards = [
  {
    id: "cc1", bank: "HDFC", name: "Millennia", last4: "4521", network: "Visa",
    limit: 100000, used: 34500, billingDate: 5, dueDate: 20, color: "#0C447C",
    recent: [
      { merchant: "Amazon", amount: 1299, date: "2026-08-29" },
      { merchant: "Netflix", amount: 649, date: "2026-08-29" },
      { merchant: "Myntra", amount: 2199, date: "2026-08-25" },
    ],
    paymentStatus: "On track",
  },
  {
    id: "cc2", bank: "SBI", name: "Cashback", last4: "7824", network: "Mastercard",
    limit: 75000, used: 18250, billingDate: 12, dueDate: 27, color: "#534AB7",
    recent: [
      { merchant: "Croma", amount: 3499, date: "2026-08-15" },
      { merchant: "Reliance Trends", amount: 1850, date: "2026-08-20" },
    ],
    paymentStatus: "Payment due in 12 days",
  },
];

export const mockSavingsGoals = [
  { id: "g1", name: "Emergency Fund", target: 100000, current: 65000, icon: "shield" },
  { id: "g2", name: "New Laptop", target: 80000, current: 45000, icon: "wallet" },
  { id: "g3", name: "Goa Trip 2027", target: 40000, current: 12000, icon: "plane" },
];

export const mockInvestments = [
  { id: "i1", name: "Axis Bluechip Fund", type: "Mutual Fund", invested: 50000, current: 57800 },
  { id: "i2", name: "Direct Equity", type: "Stocks", invested: 30000, current: 27400 },
  { id: "i3", name: "SBI Fixed Deposit", type: "Fixed Deposit", invested: 75000, current: 79650 },
];

export const mockTrips = [
  {
    id: "t1", name: "Goa Trip", dateRange: "12–15 Sept 2026",
    members: ["You", "Arun", "Karthik", "Rahul"],
    expenses: [
      { id: "te1", label: "Hotel — 3 nights", amount: 8000, paidBy: "You" },
      { id: "te2", label: "Food", amount: 2400, paidBy: "Arun" },
      { id: "te3", label: "Cab & Travel", amount: 6000, paidBy: "Karthik" },
      { id: "te4", label: "Scuba Diving", amount: 3200, paidBy: "You" },
    ],
  },
  {
    id: "t2", name: "Office Farewell", dateRange: "2 Aug 2026",
    members: ["You", "Priya", "Meena"],
    expenses: [
      { id: "te5", label: "Restaurant Bill", amount: 4500, paidBy: "Priya" },
      { id: "te6", label: "Cake", amount: 900, paidBy: "You" },
    ],
  },
];

