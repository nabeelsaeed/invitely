import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — NikahLink" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav({ to: "/dashboard" }); }, [user, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Welcome back"); nav({ to: "/dashboard" }); }
  };

  return (
    <div className="min-h-screen bg-gradient-emerald flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-script text-4xl text-gradient-gold">NikahLink</Link>
        <div className="mt-8 rounded-3xl border border-gold/30 bg-card/60 backdrop-blur p-8 shadow-elegant animate-fade-up">
          <h1 className="font-display text-3xl text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground text-center">Sign in to manage your invitations.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />
            <button
              disabled={busy}
              className="w-full rounded-full bg-gradient-gold py-3 font-medium text-primary-foreground shadow-gold disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="text-gold underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, type = "text", value, onChange, required }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl bg-input/50 border border-border px-4 py-2.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
      />
    </label>
  );
}
