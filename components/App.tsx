"use client";
import { useEffect, useState as useStateReact } from "react";
import { supabase } from "../lib/supabase";
import Auth from "./Auth";
import { useState } from "react";

const FONT = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap";

function useLocalState(key: string, initial: any) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  function set(v: any) {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }
  return [val, set];
}

function uid() { return Math.random().toString(36).slice(2, 9); }
function today() { return new Date().toISOString().slice(0, 10); }
function fmt(n: any) { return Number(n || 0).toLocaleString("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }); }

const icons = {
  dashboard: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  oferta: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>,
  klienci: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  projekty: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  faktury: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
};

const TABS = [
  { id: "dashboard", label: "Pulpit", icon: icons.dashboard },
  { id: "oferta", label: "Generator ofert", icon: icons.oferta },
  { id: "klienci", label: "Klienci", icon: icons.klienci },
  { id: "projekty", label: "Projekty", icon: icons.projekty },
  { id: "faktury", label: "Faktury", icon: icons.faktury },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setUser(data.session?.user ?? null);
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
}, []);

if (!user) return <Auth />;
  const [darkMode, setDarkMode] = useState(true);
  const [klienci, setKlienci] = useLocalState("fp_klienci", []);
  const [projekty, setProjekty] = useLocalState("fp_projekty", []);
  const [faktury, setFaktury] = useLocalState("fp_faktury", []);

  return (
    <>
      <link rel="stylesheet" href={FONT} />
      <style>{css}</style>
      <div className={`app ${darkMode ? "dark" : "light"}`}>
        <aside className="sidebar">
          <div className="sidebar-logo">freelance<span>FLOW</span></div>
          <nav className="nav">
            {TABS.map(t => (
              <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                <span className="nav-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
          <button className="btn-ghost" style={{ margin: "0 0.5rem 1rem", width: "calc(100% - 1rem)" }} onClick={() => setDarkMode(!darkMode)}>
          { darkMode ? "☀️ Jasny tryb" : "🌙 Ciemny tryb"}
          </button>
          <div className="sidebar-foot"><div className="mono" style={{ color: "#444", fontSize: 11 }}>v1.0 · beta</div></div>
        </aside>
        <main className="content">
          {tab === "dashboard" && <Dashboard klienci={klienci} projekty={projekty} faktury={faktury} />}
          {tab === "oferta" && <GeneratorOfert klienci={klienci} />}
          {tab === "klienci" && <Klienci klienci={klienci} setKlienci={setKlienci} />}
          {tab === "projekty" && <Projekty projekty={projekty} setProjekty={setProjekty} klienci={klienci} />}
          {tab === "faktury" && <Faktury faktury={faktury} setFaktury={setFaktury} klienci={klienci} projekty={projekty} />}
        </main>
        <nav className="bottom-nav">
          {TABS.map(t => (
            <button key={t.id} className={`bottom-nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <span className="bottom-nav-icon">{t.icon}</span>
              <span className="bottom-nav-label">{t.label === "Generator ofert" ? "Oferty" : t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

function Dashboard({ klienci, projekty, faktury }: any) {
  const totalPrzychod = faktury.filter((f: any) => f.status === "oplacona").reduce((s: number, f: any) => s + Number(f.kwota || 0), 0);
  const oczekujace = faktury.filter((f: any) => f.status === "wyslana").reduce((s: number, f: any) => s + Number(f.kwota || 0), 0);
  const aktywne = projekty.filter((p: any) => p.status === "w toku").length;
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Pulpit</h1>
        <div className="mono text-muted">{new Date().toLocaleDateString("pl-PL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>
      <div className="stats-grid">
        <StatCard label="Przychód (opłacone)" value={fmt(totalPrzychod)} accent="#c8f55a" />
        <StatCard label="Oczekujące płatności" value={fmt(oczekujace)} accent="#f5a623" />
        <StatCard label="Aktywne projekty" value={aktywne} accent="#5ab4f5" />
        <StatCard label="Klienci" value={klienci.length} accent="#c85af5" />
      </div>
      <div className="dash-grid">
        <div className="card">
          <div className="card-title">Ostatnie projekty</div>
          {projekty.length === 0 ? <div className="empty">Brak projektów</div> : projekty.slice(-4).reverse().map((p: any) => (
            <div key={p.id} className="list-row"><span>{p.nazwa}</span><span className={`badge badge-${p.status === "w toku" ? "green" : p.status === "zakończony" ? "gray" : "yellow"}`}>{p.status}</span></div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Ostatnie faktury</div>
          {faktury.length === 0 ? <div className="empty">Brak faktur</div> : faktury.slice(-4).reverse().map((f: any) => (
            <div key={f.id} className="list-row"><span className="mono">{f.numer}</span><span style={{ display: "flex", gap: 8, alignItems: "center" }}><span>{fmt(f.kwota)}</span><span className={`badge badge-${f.status === "oplacona" ? "green" : f.status === "wyslana" ? "yellow" : "gray"}`}>{f.status}</span></span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: any) {
  return (
    <div className="stat-card" style={{ "--accent": accent } as any}>
      <div className="stat-value">{value}</div>
      <div className="stat-label mono">{label}</div>
      <div className="stat-bar" />
    </div>
  );
}

function GeneratorOfert({ klienci }: any) {
  const [firma, setFirma] = useState("");
  const [klient, setKlient] = useState("");
  const [opis, setOpis] = useState("");
  const [budzet, setBudzet] = useState("");
  const [czas, setCzas] = useState("");
  const [jezyk, setJezyk] = useState("polski");
  const [oferta, setOferta] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!opis.trim()) { setError("Wpisz opis projektu!"); return; }
    setError(""); setLoading(true); setOferta("");
    const prompt = `Napisz profesjonalną ofertę handlową w języku ${jezyk}.\n\nDane:\n- Wystawca: ${firma || "Freelancer"}\n- Klient: ${klient || "Klient"}\n- Opis usługi: ${opis}\n${budzet ? `- Budżet: ${budzet} zł\n` : ""}${czas ? `- Czas realizacji: ${czas}\n` : ""}\nOferta powinna zawierać: krótkie wprowadzenie, zakres prac (lista), harmonogram, cenę i warunki płatności, oraz profesjonalne zakończenie. Używaj konkretnego języka, bez lania wody. Maksymalnie 400 słów.`;
    try {
      const res = await fetch("/api/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setOferta(data.content?.map((b: any) => b.text || "").join("") || "Błąd.");
    } catch { setError("Błąd połączenia."); }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">Generator ofert</h1></div>
      <div className="two-col">
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Twoja firma / imię"><input className="inp" placeholder="np. Jan Kowalski" value={firma} onChange={e => setFirma(e.target.value)} /></Field>
          {klienci.length > 0
            ? <Field label="Klient"><select className="inp" value={klient} onChange={e => setKlient(e.target.value)}><option value="">— wybierz —</option>{klienci.map((k: any) => <option key={k.id} value={k.nazwa}>{k.nazwa}</option>)}</select></Field>
            : <Field label="Klient"><input className="inp" placeholder="np. Firma ABC" value={klient} onChange={e => setKlient(e.target.value)} /></Field>
          }
          <Field label="Opis projektu *"><textarea className="inp" style={{ minHeight: 90 }} placeholder="np. Strona WWW dla sklepu" value={opis} onChange={e => { setOpis(e.target.value); setError(""); }} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Budżet (zł)"><input className="inp" placeholder="np. 8000" value={budzet} onChange={e => setBudzet(e.target.value)} /></Field>
            <Field label="Czas realizacji"><input className="inp" placeholder="np. 4 tygodnie" value={czas} onChange={e => setCzas(e.target.value)} /></Field>
          </div>
          <Field label="Język"><select className="inp" value={jezyk} onChange={e => setJezyk(e.target.value)}><option value="polski">Polski</option><option value="angielski">Angielski</option></select></Field>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn-primary" onClick={generate} disabled={loading}>{loading ? "Generuję..." : "Generuj ofertę →"}</button>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Wynik</div>
            {oferta && <button className="btn-ghost" onClick={() => { navigator.clipboard.writeText(oferta); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? "✓ Skopiowano" : "Kopiuj"}</button>}
          </div>
          <div className="preview-box mono">{oferta || <span className="text-muted">Tutaj pojawi się oferta...</span>}</div>
        </div>
      </div>
    </div>
  );
}

function Klienci({ klienci, setKlienci }: any) {
  const [form, setForm] = useState({ nazwa: "", email: "", telefon: "", notatki: "" });
  const [show, setShow] = useState(false);
  function add() {
    if (!form.nazwa.trim()) return;
    setKlienci([...klienci, { ...form, id: uid(), data: today() }]);
    setForm({ nazwa: "", email: "", telefon: "", notatki: "" }); setShow(false);
  }
  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">Klienci</h1><button className="btn-primary" onClick={() => setShow(!show)}>{show ? "Anuluj" : "+ Dodaj klienta"}</button></div>
      {show && (
        <div className="card" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Nazwa *"><input className="inp" value={form.nazwa} onChange={e => setForm({ ...form, nazwa: e.target.value })} /></Field>
            <Field label="Email"><input className="inp" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Telefon"><input className="inp" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} /></Field>
          </div>
          <Field label="Notatki"><textarea className="inp" value={form.notatki} onChange={e => setForm({ ...form, notatki: e.target.value })} /></Field>
          <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>Zapisz</button>
        </div>
      )}
      {klienci.length === 0 ? <div className="card empty">Brak klientów.</div> :
        <div className="table-wrap"><table className="table"><thead><tr><th>Nazwa</th><th>Email</th><th>Telefon</th><th>Dodano</th><th></th></tr></thead><tbody>
          {klienci.map((k: any) => <tr key={k.id}><td><strong>{k.nazwa}</strong></td><td className="mono">{k.email || "—"}</td><td className="mono">{k.telefon || "—"}</td><td className="mono text-muted">{k.data}</td><td><button className="btn-ghost" style={{ color: "#ff6b6b" }} onClick={() => setKlienci(klienci.filter((x: any) => x.id !== k.id))}>Usuń</button></td></tr>)}
        </tbody></table></div>}
    </div>
  );
}

function Projekty({ projekty, setProjekty, klienci }: any) {
  const [form, setForm] = useState({ nazwa: "", klient: "", deadline: "", budzet: "", status: "w toku", opis: "" });
  const [show, setShow] = useState(false);
  function add() {
    if (!form.nazwa.trim()) return;
    setProjekty([...projekty, { ...form, id: uid(), data: today() }]);
    setForm({ nazwa: "", klient: "", deadline: "", budzet: "", status: "w toku", opis: "" }); setShow(false);
  }
  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">Projekty</h1><button className="btn-primary" onClick={() => setShow(!show)}>{show ? "Anuluj" : "+ Nowy projekt"}</button></div>
      {show && (
        <div className="card" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Nazwa *"><input className="inp" value={form.nazwa} onChange={e => setForm({ ...form, nazwa: e.target.value })} /></Field>
            <Field label="Klient"><select className="inp" value={form.klient} onChange={e => setForm({ ...form, klient: e.target.value })}><option value="">— wybierz —</option>{klienci.map((k: any) => <option key={k.id} value={k.nazwa}>{k.nazwa}</option>)}</select></Field>
            <Field label="Deadline"><input className="inp" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></Field>
            <Field label="Budżet (zł)"><input className="inp" placeholder="np. 5000" value={form.budzet} onChange={e => setForm({ ...form, budzet: e.target.value })} /></Field>
          </div>
          <Field label="Opis"><textarea className="inp" value={form.opis} onChange={e => setForm({ ...form, opis: e.target.value })} /></Field>
          <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>Zapisz</button>
        </div>
      )}
      {projekty.length === 0 ? <div className="card empty">Brak projektów.</div> :
        <div className="projects-list">{projekty.map((p: any) => {
          const isOverdue = p.deadline && p.deadline < today() && p.status !== "zakończony";
          return (
            <div key={p.id} className="project-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div><div style={{ fontWeight: 600, fontSize: 15 }}>{p.nazwa}</div>{p.klient && <div className="mono text-muted" style={{ fontSize: 12 }}>{p.klient}</div>}</div>
                <select className="inp" style={{ width: "auto", fontSize: 12, padding: "4px 8px" }} value={p.status} onChange={e => setProjekty(projekty.map((x: any) => x.id === p.id ? { ...x, status: e.target.value } : x))}>
                  <option value="w toku">w toku</option><option value="wstrzymany">wstrzymany</option><option value="zakończony">zakończony</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 13 }}>
                {p.budzet && <span>{fmt(p.budzet)}</span>}
                {p.deadline && <span className={`mono ${isOverdue ? "text-red" : "text-muted"}`}>{isOverdue ? "⚠ " : ""}deadline: {p.deadline}</span>}
              </div>
              {p.opis && <div className="text-muted" style={{ fontSize: 13, marginTop: 8 }}>{p.opis}</div>}
              <button className="btn-ghost" style={{ color: "#ff6b6b", marginTop: 8, fontSize: 12 }} onClick={() => setProjekty(projekty.filter((x: any) => x.id !== p.id))}>Usuń</button>
            </div>
          );
        })}</div>}
    </div>
  );
}

function Faktury({ faktury, setFaktury, klienci, projekty }: any) {
  const [form, setForm] = useState({ numer: "", klient: "", projekt: "", kwota: "", termin: "", status: "szkic", opis: "" });
  const [show, setShow] = useState(false);
  function nextNum() { const y = new Date().getFullYear(); const n = faktury.filter((f: any) => f.numer?.startsWith(`FV/${y}/`)).length + 1; return `FV/${y}/${String(n).padStart(3, "0")}`; }
  function add() {
    if (!form.numer || !form.kwota) return;
    setFaktury([...faktury, { ...form, id: uid(), data: today() }]); setShow(false);
  }
  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">Faktury</h1><button className="btn-primary" onClick={show ? () => setShow(false) : () => { setForm({ numer: nextNum(), klient: "", projekt: "", kwota: "", termin: "", status: "szkic", opis: "" }); setShow(true); }}>{show ? "Anuluj" : "+ Nowa faktura"}</button></div>
      {show && (
        <div className="card" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Numer *"><input className="inp mono" value={form.numer} onChange={e => setForm({ ...form, numer: e.target.value })} /></Field>
            <Field label="Kwota (zł) *"><input className="inp" type="number" value={form.kwota} onChange={e => setForm({ ...form, kwota: e.target.value })} /></Field>
            <Field label="Klient"><select className="inp" value={form.klient} onChange={e => setForm({ ...form, klient: e.target.value })}><option value="">— wybierz —</option>{klienci.map((k: any) => <option key={k.id} value={k.nazwa}>{k.nazwa}</option>)}</select></Field>
            <Field label="Projekt"><select className="inp" value={form.projekt} onChange={e => setForm({ ...form, projekt: e.target.value })}><option value="">— wybierz —</option>{projekty.map((p: any) => <option key={p.id} value={p.nazwa}>{p.nazwa}</option>)}</select></Field>
            <Field label="Termin płatności"><input className="inp" type="date" value={form.termin} onChange={e => setForm({ ...form, termin: e.target.value })} /></Field>
          </div>
          <Field label="Opis"><textarea className="inp" value={form.opis} onChange={e => setForm({ ...form, opis: e.target.value })} /></Field>
          <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>Zapisz fakturę</button>
        </div>
      )}
      {faktury.length === 0 ? <div className="card empty">Brak faktur.</div> :
        <div className="table-wrap"><table className="table"><thead><tr><th>Numer</th><th>Klient</th><th>Kwota</th><th>Termin</th><th>Status</th><th></th></tr></thead><tbody>
          {faktury.map((f: any) => <tr key={f.id}><td className="mono">{f.numer}</td><td>{f.klient || "—"}</td><td className="mono"><strong>{fmt(f.kwota)}</strong></td><td className="mono text-muted">{f.termin || "—"}</td>
            <td><select className="inp" style={{ width: "auto", fontSize: 12, padding: "4px 8px" }} value={f.status} onChange={e => setFaktury(faktury.map((x: any) => x.id === f.id ? { ...x, status: e.target.value } : x))}><option value="szkic">szkic</option><option value="wyslana">wysłana</option><option value="oplacona">opłacona</option></select></td>
            <td><button className="btn-ghost" style={{ color: "#ff6b6b" }} onClick={() => setFaktury(faktury.filter((x: any) => x.id !== f.id))}>Usuń</button></td></tr>)}
        </tbody></table></div>}
    </div>
  );
}

function Field({ label, children }: any) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
    {children}
  </div>;
}

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0a0a0a; }
.app { display: flex; min-height: 100vh; font-family: 'Syne', sans-serif; background: #0a0a0a; color: #e8e3da; }
.sidebar { width: 220px; min-width: 220px; background: #0d0d0d; border-right: 1px solid #1a1a1a; display: flex; flex-direction: column; padding: 1.5rem 0; position: sticky; top: 0; height: 100vh; }
.sidebar-logo { font-size: 15px; font-weight: 800; letter-spacing: -1px; padding: 0 1.25rem 1.5rem; color: #e8e3da; border-bottom: 1px solid #1a1a1a; margin-bottom: 1rem; }
.sidebar-logo span { color: #c8f55a; }
.nav { display: flex; flex-direction: column; gap: 2px; padding: 0 0.5rem; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 8px; border: none; background: none; color: #555; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; text-align: left; transition: all 0.15s; }
.nav-item:hover { color: #e8e3da; background: #141414; }
.nav-item.active { color: #c8f55a; background: rgba(200,245,90,0.08); }
.nav-icon { display: flex; align-items: center; opacity: 0.8; }
.sidebar-foot { padding: 1rem 1.25rem 0; border-top: 1px solid #1a1a1a; }
.content { flex: 1; overflow-y: auto; }
.page { padding: 2rem 2.5rem; max-width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
.page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 10px; padding: 1.25rem; position: relative; overflow: hidden; }
.stat-value { font-size: 32px; font-weight: 700; margin-bottom: 6px; }
.stat-label { font-size: 11px; color: #555; }
.stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--accent); }
.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.card { background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 10px; padding: 1.25rem; }
.card-title { font-size: 12px; font-family: 'DM Mono', monospace; color: #555; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
.list-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #141414; font-size: 14px; }
.list-row:last-child { border-bottom: none; }
.empty { color: #444; font-size: 13px; font-family: 'DM Mono', monospace; padding: 1rem 0; }
.badge { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
.badge-green { background: rgba(200,245,90,0.12); color: #c8f55a; }
.badge-yellow { background: rgba(245,166,35,0.12); color: #f5a623; }
.badge-gray { background: rgba(100,100,100,0.15); color: #666; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.inp { background: #141414; border: 1px solid #1e1e1e; border-radius: 7px; color: #e8e3da; font-family: 'Syne', sans-serif; font-size: 13px; padding: 9px 12px; outline: none; transition: border-color 0.15s; width: 100%; }
.inp:focus { border-color: #c8f55a; }
textarea.inp { resize: vertical; min-height: 80px; }
select.inp option { background: #141414; }
.btn-primary { background: #c8f55a; color: #0a0a0a; border: none; border-radius: 7px; padding: 10px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-ghost { background: none; border: 1px solid #1e1e1e; border-radius: 6px; color: #666; font-family: 'Syne', sans-serif; font-size: 12px; padding: 5px 12px; cursor: pointer; transition: all 0.15s; }
.btn-ghost:hover { color: #e8e3da; border-color: #444; }
.preview-box { background: #141414; border: 1px solid #1e1e1e; border-radius: 8px; padding: 1rem; min-height: 360px; font-size: 12.5px; line-height: 1.75; color: #aaa; white-space: pre-wrap; flex: 1; overflow-y: auto; }
.error-msg { color: #ff6b6b; font-family: 'DM Mono', monospace; font-size: 12px; }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { text-align: left; font-family: 'DM Mono', monospace; font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; padding: 8px 12px; border-bottom: 1px solid #1a1a1a; }
.table td { padding: 12px 12px; border-bottom: 1px solid #141414; vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.projects-list { display: flex; flex-direction: column; gap: 12px; }
.project-card { background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 10px; padding: 1.1rem 1.25rem; }
.mono { font-family: 'DM Mono', monospace; }
.text-muted { color: #555; }
.text-red { color: #ff6b6b; }
.bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 62px; background: #0d0d0d; border-top: 1px solid #1a1a1a; z-index: 100; padding: 0 4px; }
.bottom-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; border: none; background: none; color: #444; cursor: pointer; padding: 6px 2px; transition: color 0.15s; font-family: 'Syne', sans-serif; }
.bottom-nav-item.active { color: #c8f55a; }
.bottom-nav-icon { display: flex; align-items: center; }
.bottom-nav-label { font-size: 10px; font-weight: 500; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: 1fr 1fr; } .dash-grid, .two-col { grid-template-columns: 1fr; } .page { padding: 1.5rem 1.25rem; } }
@media (max-width: 600px) { .sidebar { display: none; } .content { padding-bottom: 70px; } .bottom-nav { display: flex; } }
.light { background: #f5f5f5; color: #1a1a1a; }
.light .sidebar { background: #ffffff; border-color: #e0e0e0; }
.light .nav-item { color: #888; }
.light .nav-item:hover { background: #f0f0f0; color: #1a1a1a; }
.light .nav-item.active { color: #5a8a1a; background: rgba(90,138,26,0.08); }
.light .card { background: #ffffff; border-color: #e0e0e0; }
.light .inp { background: #f9f9f9; border-color: #e0e0e0; color: #1a1a1a; }
.light .preview-box { background: #f9f9f9; border-color: #e0e0e0; color: #444; }
.light .stat-card { background: #ffffff; border-color: #e0e0e0; }
.light .bottom-nav { background: #ffffff; border-color: #e0e0e0; }
.light .bottom-nav-item { color: #aaa; }
.light .sidebar-logo { color: #1a1a1a; }
.light .text-muted { color: #999; }`;
