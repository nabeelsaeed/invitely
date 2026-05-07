import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, MapPin, Music, Music2, Calendar, Phone, Share2, Check } from "lucide-react";
import pattern from "@/assets/nikah-pattern.jpg";
import couple from "@/assets/nikah-couple.jpg";

type Invitation = {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  bride_family: string | null;
  groom_family: string | null;
  event_title: string | null;
  event_date: string | null;
  event_time: string | null;
  venue_name: string | null;
  venue_address: string | null;
  maps_url: string | null;
  contact_phone: string | null;
  cover_image_url: string | null;
  music_enabled: boolean;
  message: string | null;
};

const DEMO: Invitation = {
  id: "demo", slug: "demo",
  bride_name: "Ayesha", groom_name: "Nabeel",
  bride_family: "Daughter of Mr. & Mrs. Hussain",
  groom_family: "Son of Mr. & Mrs. Rahman",
  event_title: "Nikah Ceremony",
  event_date: "2026-12-12", event_time: "5:00 PM onwards",
  venue_name: "Grand Palace Convention",
  venue_address: "Beach Road, Nagercoil, Tamil Nadu",
  maps_url: "https://maps.google.com/?q=Nagercoil",
  contact_phone: "+91 98765 43210",
  cover_image_url: null,
  music_enabled: true,
  message: "With the blessings of Almighty Allah, we joyfully invite you to share in our happiness as we begin our journey together.",
};

export const Route = createFileRoute("/i/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Wedding Invitation — ${params.slug}` },
      { name: "description", content: "You are invited to our wedding celebration." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async ({ params }) => {
    if (params.slug === "demo") return DEMO;
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) throw notFound();
    // best-effort view increment (fire and forget)
    void supabase
      .from("invitations")
      .update({ view_count: (data.view_count ?? 0) + 1 })
      .eq("id", data.id)
      .then(() => undefined);
    return data as Invitation;
  },
  component: InvitePage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-emerald">
      <p className="font-script text-3xl text-gold">Invitation not found</p>
    </div>
  ),
});

function InvitePage() {
  const inv = Route.useLoaderData();
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"yes" | "no" | "maybe" | null>(null);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (musicOn && audioRef.current) audioRef.current.play().catch(() => {});
    if (!musicOn && audioRef.current) audioRef.current.pause();
  }, [musicOn]);

  const open = () => {
    setOpened(true);
    if (inv.music_enabled) setMusicOn(true);
  };

  const submitRsvp = async () => {
    if (!rsvpStatus) return;
    const guestName = (document.getElementById("g-name") as HTMLInputElement)?.value || "Guest";
    const guestPhone = (document.getElementById("g-phone") as HTMLInputElement)?.value || null;
    const message = (document.getElementById("g-msg") as HTMLTextAreaElement)?.value || null;
    if (inv.id === "demo") {
      setRsvpDone(true);
      if (rsvpStatus === "yes") setRevealed(true);
      toast.success("Demo RSVP received");
      return;
    }
    const { error } = await supabase.from("rsvps").insert({
      invitation_id: inv.id,
      guest_name: guestName,
      guest_phone: guestPhone,
      status: rsvpStatus,
      message,
    });
    if (error) return toast.error(error.message);
    setRsvpDone(true);
    if (rsvpStatus === "yes") setRevealed(true);
    toast.success("RSVP submitted");
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `${inv.bride_name} & ${inv.groom_name}`, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const cover = inv.cover_image_url || couple;
  const dateStr = inv.event_date
    ? new Date(inv.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  if (!opened) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-emerald-deep relative overflow-hidden"
        style={{ backgroundImage: `url(${pattern})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-emerald-deep/60" />
        <div className="relative text-center px-6 animate-fade-up">
          <p className="font-script text-3xl text-gradient-gold animate-shimmer">Bismillah</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-foreground animate-float">
            <span className="block">{inv.groom_name}</span>
            <span className="block font-script text-gradient-gold text-4xl md:text-5xl my-2">&</span>
            <span className="block">{inv.bride_name}</span>
          </h1>
          {dateStr && <p className="mt-6 text-sm tracking-[0.4em] text-gold-soft uppercase">{dateStr}</p>}
          <button
            onClick={open}
            className="mt-10 rounded-full bg-gradient-gold px-8 py-3 font-medium text-primary-foreground shadow-gold hover:scale-105 transition"
          >
            Open invitation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-emerald relative">
      {/* Music toggle */}
      <button
        onClick={() => setMusicOn((v) => !v)}
        className="fixed top-4 right-4 z-30 rounded-full bg-card/80 backdrop-blur border border-gold/30 p-3 text-gold shadow-elegant"
        aria-label="Toggle music"
      >
        {musicOn ? <Music className="size-4 animate-pulse" /> : <Music2 className="size-4" />}
      </button>
      {inv.music_enabled && (
        <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/10/30/audio_347ee0f573.mp3" />
      )}

      {/* Cover */}
      <section className="relative">
        <div
          className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden"
          style={{ backgroundImage: `url(${pattern})`, backgroundSize: "cover" }}
        >
          <img src={cover} alt="The couple" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-center animate-fade-up">
            <p className="font-script text-2xl text-gold">together with their families</p>
            <h1 className="mt-3 font-display text-5xl">
              <span className="block animate-reveal">{inv.groom_name}</span>
              <span className="block font-script text-gradient-gold text-4xl my-1">&</span>
              <span className="block animate-reveal">{inv.bride_name}</span>
            </h1>
            <p className="mt-4 text-sm tracking-[0.3em] text-gold-soft uppercase">request your presence</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="max-w-md mx-auto px-6 py-10 space-y-10">
        {(inv.bride_family || inv.groom_family) && (
          <section className="text-center animate-fade-up">
            {inv.groom_family && <p className="text-sm text-muted-foreground">{inv.groom_family}</p>}
            <p className="my-2 font-script text-xl text-gold">&</p>
            {inv.bride_family && <p className="text-sm text-muted-foreground">{inv.bride_family}</p>}
          </section>
        )}

        {inv.message && (
          <section className="text-center animate-fade-up">
            <p className="ornament inline-block text-xs tracking-[0.3em] text-gold uppercase">Du'a</p>
            <p className="mt-3 font-display text-xl italic leading-relaxed">"{inv.message}"</p>
          </section>
        )}

        <section className="rounded-3xl border border-gold/30 bg-card/40 backdrop-blur p-8 text-center animate-fade-up">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">{inv.event_title}</p>
          <div className="my-4 flex items-center justify-center gap-3 text-2xl font-display">
            <Calendar className="size-5 text-gold" />
            <span>{dateStr || "Date TBA"}</span>
          </div>
          {inv.event_time && <p className="text-muted-foreground">{inv.event_time}</p>}
        </section>

        {/* RSVP */}
        <section className="rounded-3xl border border-gold/30 bg-card/40 backdrop-blur p-8 text-center animate-fade-up">
          <p className="font-script text-3xl text-gradient-gold">RSVP</p>
          <h3 className="mt-2 font-display text-2xl">Will you join us?</h3>

          {rsvpDone ? (
            <div className="mt-6">
              <div className="mx-auto size-14 rounded-full bg-gradient-gold flex items-center justify-center">
                <Check className="size-6 text-primary-foreground" />
              </div>
              <p className="mt-4 font-display text-xl">
                {rsvpStatus === "yes" ? "Jazakum Allahu Khairan! See you there." :
                 rsvpStatus === "no" ? "Thank you for letting us know." :
                 "Thank you — we hope to see you!"}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex gap-2 justify-center">
                {(["yes", "maybe", "no"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setRsvpStatus(opt)}
                    className={`rounded-full px-5 py-2 text-sm font-medium border transition ${
                      rsvpStatus === opt
                        ? "bg-gradient-gold text-primary-foreground border-transparent shadow-gold"
                        : "border-gold/40 text-foreground hover:bg-gold/10"
                    }`}
                  >
                    {opt === "yes" ? "Yes, with joy" : opt === "no" ? "Can't make it" : "Maybe"}
                  </button>
                ))}
              </div>
              {rsvpStatus && (
                <div className="mt-5 space-y-3 text-left animate-fade-up">
                  <input id="g-name" placeholder="Your name" className="w-full rounded-xl bg-input/50 border border-border px-4 py-2.5 outline-none focus:border-gold" />
                  <input id="g-phone" placeholder="Phone (optional)" className="w-full rounded-xl bg-input/50 border border-border px-4 py-2.5 outline-none focus:border-gold" />
                  <textarea id="g-msg" placeholder="A blessing or message…" rows={2} className="w-full rounded-xl bg-input/50 border border-border px-4 py-2.5 outline-none focus:border-gold" />
                  <button onClick={submitRsvp} className="w-full rounded-full bg-gradient-gold py-3 font-medium text-primary-foreground shadow-gold">
                    Send RSVP
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Venue (revealed when RSVP yes) */}
        {(revealed || rsvpStatus === "yes" || !rsvpDone) && (inv.venue_name || inv.venue_address) && (
          <section className="rounded-3xl border border-gold/30 bg-card/40 backdrop-blur p-8 text-center animate-fade-up">
            <p className="text-xs tracking-[0.3em] text-gold uppercase">Venue</p>
            <h3 className="mt-2 font-display text-2xl flex items-center justify-center gap-2">
              <Heart className="size-4 text-gold" /> {inv.venue_name}
            </h3>
            {inv.venue_address && <p className="mt-2 text-muted-foreground">{inv.venue_address}</p>}
            {inv.maps_url && (
              <a
                href={inv.maps_url}
                target="_blank" rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-2.5 font-medium text-primary-foreground shadow-gold"
              >
                <MapPin className="size-4" /> Navigate to venue
              </a>
            )}
          </section>
        )}

        {inv.contact_phone && (
          <a href={`tel:${inv.contact_phone}`} className="block text-center text-sm text-muted-foreground hover:text-gold">
            <Phone className="inline size-3.5 mr-1" /> {inv.contact_phone}
          </a>
        )}

        <button
          onClick={share}
          className="w-full rounded-full border border-gold/40 py-3 inline-flex items-center justify-center gap-2 hover:bg-gold/10"
        >
          <Share2 className="size-4" /> Share invitation
        </button>

        <p className="text-center text-xs text-muted-foreground pt-6 ornament">
          Made on NikahLink
        </p>
      </main>
    </div>
  );
}
