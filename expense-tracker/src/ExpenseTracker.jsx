import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Health", "Entertainment", "Other"];

const CATEGORY_CONFIG = {
  Food: { icon: "🍜", color: "#f97316" },
  Travel: { icon: "✈️", color: "#3b82f6" },
  Bills: { icon: "🧾", color: "#ef4444" },
  Shopping: { icon: "🛍️", color: "#a855f7" },
  Health: { icon: "💊", color: "#22c55e" },
  Entertainment: { icon: "🎬", color: "#eab308" },
  Other: { icon: "📦", color: "#6b7280" },
};

const API_BASE = "http://localhost:5000/api/expenses";
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const today = () => new Date().toISOString().split("T")[0];
const EMPTY_FORM = { title: "", amount: "", category: "Food", date: today() };

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null); // NEW — edit mode

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  // GET
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setExpenses(res.data);
    } catch {
      showToast("Data load nahi hua", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // POST
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || +form.amount <= 0) return showToast("Sahi details bharo", "error");
    setLoading(true);
    try {
      const res = await axios.post(API_BASE, form);
      setExpenses(prev => [res.data, ...prev]);
      closeForm();
      showToast("Expense added successfully! ✓");
    } catch {
      showToast("Add failed, try again", "error");
    } finally {
      setLoading(false);
    }
  };

  // PUT — 
  const handleEditOpen = (exp) => {
    setEditId(exp.id);
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date?.split("T")[0] || today(),
    });
    setShowForm(true);
  };

  // PUT — save
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || +form.amount <= 0) return showToast("Sahi details bharo", "error");
    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE}/${editId}`, form);
      setExpenses(prev => prev.map(ex => ex.id === editId ? res.data : ex));
      closeForm();
      showToast("Update successful! ✓");
    } catch {
      showToast("Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setExpenses(prev => prev.filter(e => e.id !== id));
      setDeleteId(null);
      showToast("Delete successful");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filtered = filter === "All" ? expenses : expenses.filter(e => e.category === filter);
  const total = expenses.reduce((s, e) => s + +e.amount, 0);
  const filteredTotal = filtered.reduce((s, e) => s + +e.amount, 0);
  const catTotals = CATEGORIES.map(c => ({
    cat: c,
    total: expenses.filter(e => e.category === c).reduce((s, e) => s + +e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const topCat = catTotals[0];
  const leastCat = catTotals[catTotals.length - 1];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #0b0f1a; color: #e2e8f0; min-height: 100vh; }
        :root {
          --bg: #0b0f1a; --surface: #131929; --surface2: #1a2236;
          --border: rgba(255,255,255,0.07); --accent: #6ee7b7; --accent2: #38bdf8;
          --danger: #f87171; --warn: #fbbf24; --text: #e2e8f0; --muted: #64748b; --radius: 16px;
        }
        .app { max-width: 900px; margin: 0 auto; padding: 24px 16px 80px; }

        /* HEADER */
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .header-left h1 { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.5px; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header-left p { color: var(--muted); font-size: 0.8rem; margin-top: 2px; }
        .btn-add { background: linear-gradient(135deg, var(--accent), var(--accent2)); border: none; color: #0b0f1a; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 0.85rem; padding: 10px 20px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: transform 0.15s, opacity 0.15s; }
        .btn-add:hover { transform: scale(1.04); opacity: 0.92; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; }
        .stat-label { color: var(--muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .stat-value { font-size: 1.4rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
        .stat-value.green { color: var(--accent); } .stat-value.blue { color: var(--accent2); }
        .stat-sub { color: var(--muted); font-size: 0.72rem; margin-top: 4px; }

        /* FILTER */
        .cat-section { margin-bottom: 20px; }
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-chip { border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-family: 'Sora', sans-serif; font-size: 0.78rem; padding: 7px 14px; border-radius: 50px; cursor: pointer; white-space: nowrap; transition: all 0.15s; display: flex; align-items: center; gap: 5px; }
        .cat-chip.active { background: linear-gradient(135deg, rgba(110,231,183,0.15), rgba(56,189,248,0.15)); border-color: var(--accent); color: var(--accent); font-weight: 600; }
        .cat-chip:hover:not(.active) { border-color: rgba(255,255,255,0.15); color: var(--text); }

        /* FORM MODAL */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.2s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .form-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; width: 100%; max-width: 440px; animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .form-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .form-title .edit-badge { font-size: 0.7rem; background: rgba(251,191,36,0.15); color: var(--warn); border: 1px solid rgba(251,191,36,0.3); padding: 3px 10px; border-radius: 50px; font-weight: 600; }
        .close-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
        .field { margin-bottom: 14px; }
        .field label { display: block; color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .field input { width: 100%; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: 'Sora', sans-serif; font-size: 0.9rem; padding: 11px 14px; border-radius: 10px; outline: none; transition: border-color 0.15s; }
        .field input:focus { border-color: var(--accent); }
        .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .cat-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-family: 'Sora', sans-serif; font-size: 0.72rem; padding: 8px 4px; border-radius: 10px; cursor: pointer; text-align: center; transition: all 0.15s; display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .cat-btn.selected { border-color: var(--accent); background: rgba(110,231,183,0.1); color: var(--accent); font-weight: 600; }
        .cat-btn span:first-child { font-size: 1.2rem; }
        .btn-submit { width: 100%; margin-top: 18px; border: none; color: #0b0f1a; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 0.9rem; padding: 13px; border-radius: 12px; cursor: pointer; transition: opacity 0.15s, transform 0.15s; }
        .btn-submit.add-mode { background: linear-gradient(135deg, var(--accent), var(--accent2)); }
        .btn-submit.edit-mode { background: linear-gradient(135deg, var(--warn), #f59e0b); }
        .btn-submit:hover { opacity: 0.9; transform: scale(1.01); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* LIST */
        .list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .list-title { font-size: 0.85rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
        .list-count { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 0.72rem; padding: 3px 10px; border-radius: 50px; }
        .expense-list { display: flex; flex-direction: column; gap: 8px; }
        .expense-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; display: flex; align-items: center; gap: 14px; transition: border-color 0.15s, transform 0.15s; animation: itemIn 0.3s ease; }
        @keyframes itemIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .expense-item:hover { border-color: rgba(255,255,255,0.12); transform: translateX(2px); }
        .cat-dot { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
        .exp-info { flex: 1; min-width: 0; }
        .exp-title { font-size: 0.92rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .exp-meta { color: var(--muted); font-size: 0.72rem; margin-top: 2px; display: flex; gap: 8px; align-items: center; }
        .exp-cat-badge { padding: 1px 8px; border-radius: 50px; font-size: 0.65rem; font-weight: 600; }
        .exp-amount { font-family: 'JetBrains Mono', monospace; font-size: 1rem; font-weight: 700; color: var(--danger); flex-shrink: 0; }
        
        /* ACTION BUTTONS */
        .action-btns { display: flex; gap: 6px; flex-shrink: 0; }
        .edit-btn { background: none; border: 1px solid transparent; color: var(--muted); cursor: pointer; width: 30px; height: 30px; border-radius: 8px; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .edit-btn:hover { border-color: var(--warn); color: var(--warn); background: rgba(251,191,36,0.1); }
        .del-btn { background: none; border: 1px solid transparent; color: var(--muted); cursor: pointer; width: 30px; height: 30px; border-radius: 8px; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .del-btn:hover { border-color: var(--danger); color: var(--danger); background: rgba(248,113,113,0.1); }

        /* CONFIRM DELETE */
        .confirm-box { background: var(--surface2); border: 1px solid var(--danger); border-radius: 14px; padding: 16px; margin-top: 8px; display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
        .btn-cancel { background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: 'Sora', sans-serif; font-size: 0.8rem; padding: 7px 14px; border-radius: 8px; cursor: pointer; }
        .btn-danger { background: var(--danger); border: none; color: white; font-family: 'Sora', sans-serif; font-size: 0.8rem; padding: 7px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; }

        /* BREAKDOWN */
        .breakdown { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; margin-bottom: 20px; }
        .breakdown-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 14px; }
        .bar-row { margin-bottom: 10px; }
        .bar-meta { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.78rem; }
        .bar-track { height: 6px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1); }

        /* EMPTY */
        .empty { text-align: center; padding: 50px 20px; color: var(--muted); }
        .empty .icon { font-size: 3rem; margin-bottom: 12px; }
        .empty p { font-size: 0.9rem; }

        /* TOAST */
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-size: 0.85rem; padding: 12px 22px; border-radius: 50px; z-index: 999; animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1); white-space: nowrap; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .toast.success { border-color: var(--accent); }
        .toast.error { border-color: var(--danger); }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

        @media (max-width: 600px) {
          .stats-row { grid-template-columns: 1fr 1fr; }
          .stats-row .stat-card:last-child { grid-column: 1 / -1; }
          .header-left h1 { font-size: 1.3rem; }
        }
      `}</style>

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>💸 Expense Tracker</h1>
            <p>Track your expenses with ease — one click away!</p>
          </div>
          <button className="btn-add" onClick={() => { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); }}>
            <span>＋</span> Add Expense
          </button>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value green">{formatINR(total)}</div>
            <div className="stat-sub">{expenses.length} entries</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">View Expenses</div>
            <div className="stat-value blue">{formatINR(filteredTotal)}</div>
            <div className="stat-sub">{filtered.length} entries</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Most Expensive</div> 
            <div className="stat-value" style={{ fontSize: "1rem", color: topCat ? CATEGORY_CONFIG[topCat.cat]?.color : "var(--muted)" }}>
              {topCat ? `${CATEGORY_CONFIG[topCat.cat]?.icon} ${topCat.cat}` : "—"}
            </div>
            <div className="stat-sub">{topCat ? formatINR(topCat.total) : "No data available"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Least Expensive</div> 
            <div className="stat-value" style={{ fontSize: "1rem", color: leastCat ? CATEGORY_CONFIG[leastCat.cat]?.color : "var(--muted)" }}>
              {leastCat ? `${CATEGORY_CONFIG[leastCat.cat]?.icon} ${leastCat.cat}` : "—"}
            </div>
            <div className="stat-sub">{leastCat ? formatINR(leastCat.total) : "No data available"}</div>
          </div>
        </div>

        {/* BREAKDOWN */}
        {catTotals.length > 0 && (
          <div className="breakdown">
            <div className="breakdown-title">Expense Breakdown by Category</div> 
            {catTotals.map(({ cat, total: ct }) => (
              <div className="bar-row" key={cat}>
                <div className="bar-meta">
                  <span>{CATEGORY_CONFIG[cat]?.icon} {cat}</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>{formatINR(ct)}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(ct / total) * 100}%`, background: CATEGORY_CONFIG[cat]?.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FILTER */}
        <div className="cat-section">
          <div className="cat-scroll">
            {["All", ...CATEGORIES].map(c => (
              <button key={c} className={`cat-chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
                {c !== "All" && CATEGORY_CONFIG[c]?.icon} {c}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="list-header">
          <span className="list-title">Transactions</span>
          <span className="list-count">{filtered.length} items</span>
        </div>

        {loading ? (
          <div className="empty"><div className="icon">⏳</div><p>Load ho raha hai...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">🪹</div>
            <p>Koi expense nahi mila<br /><span style={{ fontSize: "0.8rem" }}>Add karo upar wale button se!</span></p>
          </div>
        ) : (
          <div className="expense-list">
            {filtered.map(exp => (
              <div key={exp.id}>
                <div className="expense-item">
                  <div className="cat-dot" style={{ background: CATEGORY_CONFIG[exp.category]?.color + "22" }}>
                    {CATEGORY_CONFIG[exp.category]?.icon}
                  </div>
                  <div className="exp-info">
                    <div className="exp-title">{exp.title}</div>
                    <div className="exp-meta">
                      <span className="exp-cat-badge" style={{ background: CATEGORY_CONFIG[exp.category]?.color + "22", color: CATEGORY_CONFIG[exp.category]?.color }}>
                        {exp.category}
                      </span>
                      <span>{new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  <div className="exp-amount">−{formatINR(exp.amount)}</div>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleEditOpen(exp)} title="Edit">✏️</button>
                    <button className="del-btn" onClick={() => setDeleteId(deleteId === exp.id ? null : exp.id)} title="Delete">🗑</button>
                  </div>
                </div>
                {deleteId === exp.id && (
                  <div className="confirm-box">
                    <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--muted)" }}>Are you sure you want to delete this expense?</span>
                    <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                    <button className="btn-danger" onClick={() => handleDelete(exp.id)}>Yes, Delete it</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD / EDIT FORM MODAL */}
      {showForm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && closeForm()}>
          <div className="form-card">
            <div className="form-title">
              <span>
                {editId ? "✏️ Edit Expense" : "New Expense"}
                {editId && <span className="edit-badge" style={{ marginLeft: 8 }}>EDIT MODE</span>}
              </span>
              <button className="close-btn" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={editId ? handleUpdate : handleAdd}>
              <div className="field">
                <label>Title</label>
                <input
                  placeholder="What was the expense? (e.g. Dinner, Metro)"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  min="1"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Category</label>
                <div className="cat-grid">
                  {CATEGORIES.map(c => (
                    <button
                      type="button"
                      key={c}
                      className={`cat-btn ${form.category === c ? "selected" : ""}`}
                      onClick={() => setForm(f => ({ ...f, category: c }))}
                    >
                      <span>{CATEGORY_CONFIG[c]?.icon}</span>
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className={`btn-submit ${editId ? "edit-mode" : "add-mode"}`} disabled={loading}>
                {loading ? "Saving..." : editId ? "Update ✓" : "Add Expense ✓"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
