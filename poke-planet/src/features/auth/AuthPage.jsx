import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import "./AuthPage.css";

export default function AuthPage() {
  const { token, login, register } = useSession();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (token) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await (mode === "login" ? login(form) : register(form));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Poké Planets</h1>
        <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
        <label>
          Username
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            minLength="3"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength="10"
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button disabled={busy}>
          {busy ? "Working..." : mode === "login" ? "Sign in" : "Register"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account?" : "Already registered?"}
        </button>
      </form>
    </main>
  );
}
