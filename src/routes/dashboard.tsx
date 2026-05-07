import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Plus, ExternalLink, Pencil, LogOut, Eye } from "lucide-react";

type Invitation = {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  event_date: string | null;
  view_count: number;
  is_published: boolean;
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Your invitations — NikahLink" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, slug, bride_name, groom_name, event_date, view_count, is_published")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setInvites(data ?? []);
      setFetching(false);
    })();
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-emerald">
      <header className="px-5 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="font-script text-3xl text-gradient-gold">NikahLink</Link>
        <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
          <LogOut className="size-4" /> Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-4xl">Your invitations</h1>
            <p className="text-muted-foreground mt-1">Create, edit and share.</p>
          </div>
          <Link
            to="/builder/$id"
            params={{ id: "new" }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 font-medium text-primary-foreground shadow-gold"
          >
            <Plus className="size-4" /> New invitation
          </Link>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetching ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : invites.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-gold/30 p-12 text-center">
              <p className="font-script text-3xl text-gradient-gold">Begin the journey</p>
              <p className="mt-2 text-muted-foreground">No invitations yet. Create your first one.</p>
              <Link
                to="/builder/$id"
                params={{ id: "new" }}
                className="mt-5 inline-flex rounded-full bg-gradient-gold px-5 py-2.5 font-medium text-primary-foreground shadow-gold"
              >
                Create invitation
              </Link>
            </div>
          ) : (
            invites.map((inv) => (
              <article key={inv.id} className="rounded-2xl border border-border bg-card/40 backdrop-blur p-5 hover:border-gold/40 transition">
                <p className="font-script text-2xl text-gold">{inv.bride_name} & {inv.groom_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {inv.event_date ?? "Date TBA"} · <Eye className="inline size-3" /> {inv.view_count}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    to="/builder/$id" params={{ id: inv.id }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                  <Link
                    to="/i/$slug" params={{ slug: inv.slug }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-gold px-3 py-2 text-sm font-medium text-primary-foreground"
                  >
                    <ExternalLink className="size-3.5" /> Open
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
