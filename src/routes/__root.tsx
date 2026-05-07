import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-script text-6xl text-gradient-gold">404</p>
        <h1 className="mt-2 font-display text-3xl">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The invitation you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-gold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NikahLink — Beautiful digital wedding invitations" },
      { name: "description", content: "Create animated, shareable wedding & nikah invitations in minutes. RSVP, venue maps, music, and more." },
      { property: "og:title", content: "NikahLink — Beautiful digital wedding invitations" },
      { property: "og:description", content: "Create animated, shareable wedding & nikah invitations in minutes. RSVP, venue maps, music, and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NikahLink — Beautiful digital wedding invitations" },
      { name: "twitter:description", content: "Create animated, shareable wedding & nikah invitations in minutes. RSVP, venue maps, music, and more." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9413dfd9-e551-4925-8cda-69fd53bcfc0b/id-preview-9a35ddc5--14c22ab0-cbf2-4536-b3ed-426317aaf6b3.lovable.app-1778167769231.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9413dfd9-e551-4925-8cda-69fd53bcfc0b/id-preview-9a35ddc5--14c22ab0-cbf2-4536-b3ed-426317aaf6b3.lovable.app-1778167769231.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
