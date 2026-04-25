import { useState } from "react";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

const SEED_HINT = "seed@medisync.local";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onLogin(email.trim());
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Icon name="medical_services" className="text-blue-600 text-3xl" fill={1} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">MediSync</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in with your patient email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button variant="primary" size="full" onClick={handleSubmit} loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-6">
          Dev seed account: <span className="font-mono text-slate-600">{SEED_HINT}</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
