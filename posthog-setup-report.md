<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **DevEvent** Next.js App Router project. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new file): Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` convention. Configured with a reverse proxy path (`/ingest`), error tracking (`capture_exceptions: true`), the `2026-01-30` defaults, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites routing `/ingest/*` to the PostHog EU ingestion endpoint (`https://eu.i.posthog.com`), plus `skipTrailingSlashRedirect: true` for PostHog API compatibility.
- **`components/ExploreBtn.tsx`** (updated): Added `"use client"` directive and PostHog capture for `explore_events_clicked` when the hero CTA button is clicked.
- **`components/EventCard.tsx`** (updated): Added `"use client"` directive and PostHog capture for `event_card_clicked` with rich properties (`event_title`, `event_slug`, `event_location`, `event_date`) when a user clicks on an event card.
- **`components/Navbar.tsx`** (updated): Added `"use client"` directive and PostHog capture for `nav_link_clicked` with `label` and `destination` properties on every navigation link click.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' CTA button on the homepage hero section, indicating intent to browse events. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view details. Captures `event_title`, `event_slug`, `event_location`, and `event_date` as properties. | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the top navbar. Captures the link `label` and `destination`. | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: https://eu.posthog.com/project/134002/dashboard/546935
- 📈 **Explore Events CTA Clicks (Daily)**: https://eu.posthog.com/project/134002/insights/IXufwgt2
- 📈 **Event Card Clicks (Daily)**: https://eu.posthog.com/project/134002/insights/XWm5BCZk
- 🔀 **Explore → Event Card Conversion Funnel**: https://eu.posthog.com/project/134002/insights/fQQECWau
- 📊 **Most Clicked Events** (by event title): https://eu.posthog.com/project/134002/insights/8KqQmvF9
- 📊 **Navigation Link Clicks by Label**: https://eu.posthog.com/project/134002/insights/xyIPDPg0

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
