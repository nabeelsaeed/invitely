import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Field } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — NikahLink" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav({ to: "/dashboard" }); }, [user, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Account created"); nav({ to: "/dashboard" }); }
  };

  return (
    <div className="min-h-screen bg-gradient-emerald flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-script text-4xl text-gradient-gold">NikahLink</Link>
        <div className="mt-8 rounded-3xl border border-gold/30 bg-card/60 backdrop-blur p-8 shadow-elegant animate-fade-up">
          <h1 className="font-display text-3xl text-center">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground text-center">Start your first invitation in seconds.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Full name" value={fullName} onChange={setFullName} required />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />
            <button
              disabled={busy}
              className="w-full rounded-full bg-gradient-gold py-3 font-medium text-primary-foreground shadow-gold disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already a user? <Link to="/login" className="text-gold underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
