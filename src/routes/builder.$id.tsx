import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, slugify } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { Field } from "./login";

export const Route = createFileRoute("/builder/$id")({
  head: () => ({ meta: [{ title: "Invitation builder — NikahLink" }] }),
  component: Builder,
});

type Form = {
  bride_name: string;
  groom_name: string;
  bride_family: string;
  groom_family: string;
  event_title: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  maps_url: string;
  contact_phone: string;
  cover_image_url: string;
  message: string;
  music_enabled: boolean;
  is_published: boolean;
};

const empty: Form = {
  bride_name: "", groom_name: "", bride_family: "", groom_family: "",
  event_title: "Nikah Ceremony", event_date: "", event_time: "",
  venue_name: "", venue_address: "", maps_url: "", contact_phone: "",
  cover_image_url: "", message: "", music_enabled: true, is_published: true,
};

function Builder() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<Form>(empty);
  const [slug, setSlug] = useState("");
  const [savedId, setSavedId] = useState<string | null>(id === "new" ? null : id);
  const [busy, setBusy] = useState(false);
  const isNew = id === "new";

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  useEffect(() => {
    if (isNew || !user) return;
    (async () => {
      const { data, error } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle();
      if (error) return toast.error(error.message);
      if (data) {
        setForm({
          bride_name: data.bride_name, groom_name: data.groom_name,
          bride_family: data.bride_family ?? "", groom_family: data.groom_family ?? "",
          event_title: data.event_title ?? "", event_date: data.event_date ?? "",
          event_time: data.event_time ?? "", venue_name: data.venue_name ?? "",
          venue_address: data.venue_address ?? "", maps_url: data.maps_url ?? "",
          contact_phone: data.contact_phone ?? "", cover_image_url: data.cover_image_url ?? "",
          message: data.message ?? "", music_enabled: data.music_enabled,
          is_published: data.is_published,
        });
        setSlug(data.slug);
      }
    })();
  }, [id, isNew, user]);

  const update = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.bride_name || !form.groom_name) {
      toast.error("Bride and groom names are required");
      return;
    }
    setBusy(true);
    const baseSlug = slug || slugify(`${form.groom_name}-weds-${form.bride_name}`);
    const finalSlug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    const payload = {
      ...form,
      event_date: form.event_date || null,
      user_id: user.id,
      category: "nikah" as const,
      theme: "nikah",
    };

    if (savedId) {
      const { error } = await supabase.from("invitations").update(payload).eq("id", savedId);
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    } else {
      const { data, error } = await supabase
        .from("invitations")
        .insert({ ...payload, slug: finalSlug })
        .select("id, slug")
        .single();
      setBusy(false);
      if (error) return toast.error(error.message);
      setSavedId(data.id);
      setSlug(data.slug);
      toast.success("Created");
      nav({ to: "/builder/$id", params: { id: data.id } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-emerald">
      <header className="px-5 py-5 flex items-center justify-between max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
        {slug && (
          <Link to="/i/$slug" params={{ slug }} className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
            <ExternalLink className="size-4" /> Open invitation
          </Link>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-5 py-6">
        <h1 className="font-display text-4xl">
          {isNew && !savedId ? "New invitation" : "Edit invitation"}
        </h1>
        <p className="text-muted-foreground mt-1">Fill in the details. You can update them anytime.</p>

        <form onSubmit={save} className="mt-8 space-y-6">
          <Section title="The Couple">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Bride's name" value={form.bride_name} onChange={update("bride_name")} required />
              <Field label="Groom's name" value={form.groom_name} onChange={update("groom_name")} required />
              <Field label="Bride's family" value={form.bride_family} onChange={update("bride_family")} />
              <Field label="Groom's family" value={form.groom_family} onChange={update("groom_family")} />
            </div>
          </Section>

          <Section title="The Event">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Event title" value={form.event_title} onChange={update("event_title")} />
              <Field label="Date" type="date" value={form.event_date} onChange={update("event_date")} />
              <Field label="Time" value={form.event_time} onChange={update("event_time")} />
              <Field label="Contact phone" value={form.contact_phone} onChange={update("contact_phone")} />
            </div>
          </Section>

          <Section title="Venue">
            <div className="space-y-4">
              <Field label="Venue name" value={form.venue_name} onChange={update("venue_name")} />
              <Field label="Address" value={form.venue_address} onChange={update("venue_address")} />
              <Field label="Google Maps link" value={form.maps_url} onChange={update("maps_url")} />
            </div>
          </Section>

          <Section title="Personal Touch">
            <div className="space-y-4">
              <Field label="Couple photo URL" value={form.cover_image_url} onChange={update("cover_image_url")} />
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Message to guests</span>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl bg-input/50 border border-border px-4 py-2.5 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.music_enabled}
                  onChange={(e) => setForm({ ...form, music_enabled: e.target.checked })}
                  className="size-4 accent-[var(--gold)]"
                />
                Play background music
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="size-4 accent-[var(--gold)]"
                />
                Published (publicly viewable)
              </label>
            </div>
          </Section>

          <button
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 font-medium text-primary-foreground shadow-gold disabled:opacity-60"
          >
            <Save className="size-4" /> {busy ? "Saving…" : "Save invitation"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6">
      <h2 className="font-display text-xl text-gold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
