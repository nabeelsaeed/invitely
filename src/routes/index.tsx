import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, MapPin, Music, Share2, Calendar } from "lucide-react";
import couple from "@/assets/nikah-couple.jpg";
import pattern from "@/assets/nikah-pattern.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NikahLink — Beautiful animated wedding invitations" },
      { name: "description", content: "Create and share stunning digital wedding & nikah invitations with RSVP, music, and venue navigation. Made for Tamil Nadu, Kerala and beyond." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-emerald">
      {/* Nav */}
      <header className="px-5 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="font-script text-3xl text-gradient-gold">NikahLink</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/login" className="text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link
            to="/signup"
            className="rounded-full bg-gradient-gold px-4 py-2 font-medium text-primary-foreground shadow-gold"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-5 pt-8 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold pointer-events-none" />
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <p className="ornament inline-block font-script text-2xl text-gold">Bismillah</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05]">
              Wedding invitations,{" "}
              <span className="text-gradient-gold italic">reimagined</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-md">
              Design animated, mobile-first nikah & wedding invitations your guests
              will actually open. Share a link on WhatsApp — collect RSVPs instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-full bg-gradient-gold px-7 py-3 font-medium text-primary-foreground shadow-gold hover:scale-[1.02] transition"
              >
                Create your invitation
              </Link>
              <Link
                to="/i/$slug"
                params={{ slug: "demo" }}
                className="rounded-full border border-gold/40 px-7 py-3 text-foreground hover:bg-gold/10 transition"
              >
                See live demo
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Plans from ₹499 · Tamil & English · WhatsApp-ready
            </p>
          </div>

          <div className="relative animate-fade-up [animation-delay:200ms]">
            <div
              className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl"
              style={{ background: "var(--gradient-gold)" }}
            />
            <div className="relative rounded-[2rem] overflow-hidden border border-gold/30 shadow-elegant aspect-[3/4]">
              <img
                src={couple}
                alt="Muslim bride and groom in elegant attire"
                width={832}
                height={1216}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="font-script text-3xl text-gold animate-shimmer">Nabeel & Ayesha</p>
                <p className="mt-1 text-xs tracking-[0.3em] text-gold-soft/80">12 · 12 · 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-16 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-center">
            Everything for the perfect <span className="text-gradient-gold">invite</span>
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, t: "Cinematic animations", d: "Reveals, floating gold particles, elegant transitions." },
              { icon: Music, t: "Background music", d: "Set the mood with a curated track. Guests can toggle." },
              { icon: Heart, t: "Smart RSVP", d: "Yes / No / Maybe responses, all in one dashboard." },
              { icon: MapPin, t: "Venue & maps", d: "One-tap navigation in Google or Apple Maps." },
              { icon: Share2, t: "WhatsApp-ready", d: "A short link that previews beautifully on chat." },
              { icon: Calendar, t: "Save the date", d: "Countdown built in. Add to calendar in one tap." },
            ].map((f, i) => (
              <div
                key={f.t}
                className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-gold/40 transition animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="size-10 rounded-xl bg-gradient-gold flex items-center justify-center text-primary-foreground">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-5 py-20">
        <div
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-gold/30 p-10 md:p-14 text-center shadow-elegant"
          style={{ backgroundImage: `url(${pattern})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-emerald-deep/70" />
          <div className="relative">
            <p className="font-script text-3xl text-gradient-gold">Bless the union</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl">Ready in minutes. Loved for a lifetime.</h2>
            <Link
              to="/signup"
              className="mt-8 inline-flex rounded-full bg-gradient-gold px-8 py-3 font-medium text-primary-foreground shadow-gold"
            >
              Start your invitation
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-5 py-8 text-center text-xs text-muted-foreground border-t border-border/30">
        <span className="ornament">NikahLink · Made with love</span>
      </footer>
    </div>
  );
}
