"use client";
import { useState } from "react";
import { supabase } from "../app/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handle() {
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess("Sprawdź email i potwierdź rejestrację!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Nieprawidłowy email lub hasło");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif"
    }}>
      <div style={{
        background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12,
        padding: "2rem", width: 360, display: "flex", flexDirection: "column", gap: 16
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e8e3da", letterSpacing: -1 }}>
          freelance<span style={{ color: "#c8f55a" }}>FLOW</span>
        </div>
        <div style={{ fontSize: 14, color: "#555" }}>
          {mode === "login" ? "Zaloguj się" : "Załóż konto"}
        </div>

        <input
          style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 7, color: "#e8e3da", fontSize: 13, padding: "9px 12px", outline: "none", width: "100%" }}
          type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 7, color: "#e8e3da", fontSize: 13, padding: "9px 12px", outline: "none", width: "100%" }}
          type="password" placeholder="Hasło (min. 6 znaków)" value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div style={{ color: "#ff6b6b", fontSize: 12 }}>{error}</div>}
        {success && <div style={{ color: "#c8f55a", fontSize: 12 }}>{success}</div>}

        <button
          style={{ background: "#c8f55a", color: "#0a0a0a", border: "none", borderRadius: 7, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          onClick={handle} disabled={loading}
        >
          {loading ? "Ładowanie..." : mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
        </button>

        <div style={{ fontSize: 12, color: "#555", textAlign: "center", cursor: "pointer" }}
          onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
        </div>
      </div>
    </div>
  );
}