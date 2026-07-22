import React, { useEffect, useMemo, useState } from "react";
import {
  Refrigerator,
  Plus,
  X,
  Trash2,
  Search,
  Pencil,
  Check,
  Calendar,
  AlertTriangle,
  Tag,
  PackageOpen,
} from "lucide-react";

const STORAGE_KEY = "fridge-manager-items-v1";

const emptyForm = {
  name: "",
  category: "채소",
  storage: "냉장",
  quantity: "1",
  unit: "개",
  expiryDate: "",
  memo: "",
};

function loadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("저장 데이터 불러오기 실패", error);
    return [];
  }
}

function daysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${dateString}T00:00:00`);
  return Math.ceil((expiry - today) / 86400000);
}

function expiryLabel(dateString) {
  const days = daysUntil(dateString);
  if (days === null) return { text: "기한 미설정", tone: "muted" };
  if (days < 0) return { text: `${Math.abs(days)}일 지남`, tone: "danger" };
  if (days === 0) return { text: "오늘까지", tone: "danger" };
  if (days <= 3) return { text: `${days}일 남음`, tone: "warning" };
  return { text: `${days}일 남음`, tone: "safe" };
}

export default function App() {
  const [items, setItems] = useState(loadItems);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [storageFilter, setStorageFilter] = useState("전체");
  const [saveState, setSaveState] = useState("저장 완료");

  useEffect(() => {
    try {
      setSaveState("저장 중...");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      const timer = setTimeout(() => setSaveState("저장 완료"), 250);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("데이터 저장 실패", error);
      setSaveState("저장 실패");
    }
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => storageFilter === "전체" || item.storage === storageFilter)
      .filter((item) => {
        const target = `${item.name} ${item.category} ${item.memo}`.toLowerCase();
        return target.includes(query.trim().toLowerCase());
      })
      .sort((a, b) => {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return a.expiryDate.localeCompare(b.expiryDate);
      });
  }, [items, query, storageFilter]);

  const summary = useMemo(() => {
    const expiring = items.filter((item) => {
      const days = daysUntil(item.expiryDate);
      return days !== null && days >= 0 && days <= 3;
    }).length;
    const expired = items.filter((item) => {
      const days = daysUntil(item.expiryDate);
      return days !== null && days < 0;
    }).length;
    return { total: items.length, expiring, expired };
  }, [items]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function submitForm(event) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...form, name, updatedAt: Date.now() }
            : item
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          ...form,
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]);
    }
    resetForm();
  }

  function editItem(item) {
    setForm({
      name: item.name,
      category: item.category,
      storage: item.storage,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate,
      memo: item.memo,
    });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteItem(id) {
    if (!window.confirm("이 식재료를 삭제할까요?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="brand-row">
          <div className="brand-icon"><Refrigerator size={26} /></div>
          <div>
            <p className="eyebrow">MY KITCHEN</p>
            <h1>냉장고 관리</h1>
          </div>
          <span className={`save-state ${saveState === "저장 실패" ? "error" : ""}`}>
            <Check size={14} /> {saveState}
          </span>
        </div>
        <p className="hero-copy">식재료와 유통기한을 한곳에서 간단하게 관리하세요.</p>

        <section className="summary-grid">
          <article><PackageOpen size={20} /><strong>{summary.total}</strong><span>전체 식재료</span></article>
          <article><Calendar size={20} /><strong>{summary.expiring}</strong><span>3일 이내</span></article>
          <article><AlertTriangle size={20} /><strong>{summary.expired}</strong><span>기한 지남</span></article>
        </section>
      </header>

      <section className="toolbar">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="식재료 검색" />
          {query && <button onClick={() => setQuery("")} aria-label="검색어 지우기"><X size={17} /></button>}
        </label>
        <button className="primary-button" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus size={18} /> 식재료 추가
        </button>
      </section>

      <nav className="filter-row" aria-label="보관 위치 필터">
        {["전체", "냉장", "냉동", "실온"].map((value) => (
          <button key={value} className={storageFilter === value ? "active" : ""} onClick={() => setStorageFilter(value)}>
            {value}
          </button>
        ))}
      </nav>

      {showForm && (
        <section className="form-card">
          <div className="section-title">
            <div><Tag size={19} /><h2>{editingId ? "식재료 수정" : "식재료 등록"}</h2></div>
            <button className="icon-button" onClick={resetForm} aria-label="닫기"><X size={20} /></button>
          </div>
          <form onSubmit={submitForm}>
            <div className="form-grid">
              <label className="wide">품목명<input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 계란" /></label>
              <label>분류<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["채소", "과일", "육류", "수산물", "유제품", "가공식품", "음료", "기타"].map((v) => <option key={v}>{v}</option>)}</select></label>
              <label>보관 위치<select value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })}>{["냉장", "냉동", "실온"].map((v) => <option key={v}>{v}</option>)}</select></label>
              <label>수량<input type="number" min="0" step="0.1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
              <label>단위<select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>{["개", "봉", "팩", "병", "캔", "g", "kg", "ml", "L"].map((v) => <option key={v}>{v}</option>)}</select></label>
              <label className="wide">유통기한<input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></label>
              <label className="wide">메모<textarea rows="3" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} placeholder="구매처, 용도 등을 기록하세요." /></label>
            </div>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={resetForm}>취소</button>
              <button type="submit" className="primary-button"><Check size={18} /> {editingId ? "수정 저장" : "등록 저장"}</button>
            </div>
          </form>
        </section>
      )}

      <section className="items-section">
        <div className="list-heading">
          <h2>식재료 목록</h2>
          <span>{filteredItems.length}개</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <Refrigerator size={42} />
            <h3>등록된 식재료가 없습니다</h3>
            <p>식재료를 추가하면 자동으로 저장됩니다.</p>
          </div>
        ) : (
          <div className="item-list">
            {filteredItems.map((item) => {
              const expiry = expiryLabel(item.expiryDate);
              return (
                <article className="item-card" key={item.id}>
                  <div className="item-main">
                    <div className="item-topline">
                      <div>
                        <span className="category-chip">{item.category}</span>
                        <span className="storage-chip">{item.storage}</span>
                      </div>
                      <span className={`expiry-badge ${expiry.tone}`}>{expiry.text}</span>
                    </div>
                    <h3>{item.name}</h3>
                    <p className="item-meta">{item.quantity || 0}{item.unit} {item.expiryDate ? `· ${item.expiryDate}` : ""}</p>
                    {item.memo && <p className="item-memo">{item.memo}</p>}
                  </div>
                  <div className="item-actions">
                    <button onClick={() => editItem(item)} aria-label="수정"><Pencil size={17} /></button>
                    <button className="delete" onClick={() => deleteItem(item.id)} aria-label="삭제"><Trash2 size={17} /></button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
