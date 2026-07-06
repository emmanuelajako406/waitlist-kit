# Waitlist Kit

A Next.js waitlist starter that uses a **Notion database** as its backend, plus a small set of ready-made UI components for building the landing page.

## Table of Contents

- [Setup Guide](#setup-guide)
  - [Prerequisites](#prerequisites)
  - [1. Create the Notion Waitlist Database](#1-create-the-notion-waitlist-database)
  - [2. Create a Notion Integration](#2-create-a-notion-integration)
  - [3. Get Your Database ID](#3-get-your-database-id)
  - [4. Install WaitKit](#4-install-waitkit)
  - [5. Configure Environment Variables](#5-configure-environment-variables)
  - [6. Run Locally](#6-run-locally)
  - [7. Notion Client Setup (Reference)](#7-notion-client-setup-reference)
  - [Deploying to Vercel](#deploying-to-vercel)
  - [Notion API Rate Limits](#notion-api-rate-limits)
  - [Troubleshooting](#troubleshooting)
  - [Next Steps](#next-steps)
- [Components](#components)
  - [AvatarStack](#avatarstack)
  - [CountdownTimer](#countdowntimer)
  - [Logo](#logo)
  - [Badge](#badge)
  - [Input](#input)
  - [Button](#button)
  - [Shared Conventions](#shared-conventions-across-these-components)

---

## Setup Guide

WaitKit lets you spin up a waitlist landing page in minutes, using a **Notion database** as your backend instead of a traditional database like Postgres or MongoDB. Every signup becomes a new row in your Notion table — easy to view, filter, sort, and export without building an admin dashboard.

### Prerequisites

- Node.js 18+
- A Notion account (free tier works)
- A Vercel account (or any Next.js-compatible host)

### 1. Create the Notion Waitlist Database

1. In Notion, create a new **full-page database** (Table view) called `Waitlist`.
2. Add the following properties:

| Property Name | Type | Notes |
|---|---|---|
| `Email` | Title | Primary property, must be type "Title" |
| `Name` | Text | Optional |
| `Referrer` | Text | Optional, tracks where signup came from |
| `Status` | Select | Options: `Pending`, `Invited`, `Onboarded` |
| `Joined At` | Date | Auto-filled on signup |
| `Position` | Number | Optional, waitlist queue position |

> **Tip:** Keep `Email` as the Title property — WaitKit uses it as the unique identifier when checking for duplicate signups.

3. Click **Share** (top right of the database) → **Invite** → add your connection (created in the next step) with **Can edit** access.

### 2. Create a Notion Integration

1. Go to [notion.so/my-integrations](https://app.notion.com/developers/connections).
2. Click **New connection**.
3. Name it (e.g. `WaitKit Production`), select the associated workspace, and set capabilities to:
   - Read content
   - Insert content
   - Update content
4. Copy the **Integration access token** — this is your `NOTION_API_KEY`.

### 3. Get Your Database ID

Open your Notion database in the browser. The URL looks like:

```
https://www.notion.so/yourworkspace/1a2b3c4d5e6f7g8h9i0j?v=...
```

The **32-character string** right after your workspace name (before `?v=`) is your `NOTION_DATABASE_ID`.

### 4. Install Waitlist Kit

```bash
cd waitlist-kit
npm install
```

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
The database ID is the 32-character identifier.
The URL should look similar to:

https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...

| Variable | Description |
|---|---|
| `NOTION_API_KEY` | Internal integration secret from step 2 |
| `NOTION_DATABASE_ID` | Database ID from step 3 |
| `NEXT_PUBLIC_SITE_URL` | Base URL, used for redirect/share links |

> `.env.local` is gitignored by default — never commit real secrets. See the [environment variables guide](#deploying-to-vercel) below for production setup.

### 6. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` — submit a test email and confirm a new row appears in your Notion `Waitlist` database.

### 7. Notion Client Setup (Reference)

WaitKit's API route (`app/api/waitlist/route.ts`) talks to Notion via the official SDK:

```ts
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(req: Request) {
  const { email, name, referrer } = await req.json();

  // Check for existing entry
  const existing = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Email",
      title: { equals: email },
    },
  });

  if (existing.results.length > 0) {
    return Response.json({ status: "already_joined" }, { status: 200 });
  }

  await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID! },
    properties: {
      Email: { title: [{ text: { content: email } }] },
      Name: { rich_text: [{ text: { content: name ?? "" } }] },
      Referrer: { rich_text: [{ text: { content: referrer ?? "direct" } }] },
      Status: { select: { name: "Pending" } },
      "Joined At": { date: { start: new Date().toISOString() } },
    },
  });

  return Response.json({ status: "success" }, { status: 201 });
}
```

### Deploying to Vercel

1. Push your repo to GitHub and import it into Vercel.
2. In **Project Settings → Environment Variables**, add `NOTION_SECRET` and `NOTION_DATABASE_ID` for **Production** and **Preview** environments.
3. Redeploy. Vercel does not read your local `.env.local` file — variables must be set in the dashboard.

To keep local and deployed environments in sync:

```bash
vercel env pull .env.local
```

### Notion API Rate Limits

Notion's API allows roughly 3 requests per second, per integration. For high-traffic launches, consider adding a queue (e.g. Upstash Redis) in front of the Notion write, or batching signups every few seconds instead of writing on every request.

### Troubleshooting

| Issue | Likely Cause |
|---|---|
| `401 Unauthorized` | Integration not shared with the database (see step 1.3) |
| `object_not_found` | Wrong `NOTION_DATABASE_ID`, or integration lacks access |
| Duplicate signups appearing | `Email` property isn't set as the Title type |
| Works locally, fails on Vercel | Env vars not set in Vercel dashboard |

### Next Steps

- Add email confirmation via Resend or Postmark
- Show live waitlist count by querying `notion.databases.query` and counting results
- Add a referral system using the `Referrer` field to rank invite leaderboard

---

## Components

Reference documentation for the UI components: `AvatarStack`, `CountdownTimer`, `Logo`, `Badge`, `Input`, and `Button`. All are built with Tailwind CSS and expect a `cn()` class-merging utility at `@/lib/utils` (typically `clsx` + `tailwind-merge`).

---

### AvatarStack

Displays an overlapping stack of avatar images ("social proof" pile), optionally paired with a text label like `"1,204 people joined"`.

#### Import

```tsx
import { AvatarStack } from "@/components/avatar-stack";
```

#### Usage

```tsx
<AvatarStack
  images={[
    "/avatars/user1.jpg",
    "/avatars/user2.jpg",
    "/avatars/user3.jpg",
  ]}
  text="Joined by 1,200+ builders"
  textPosition="right"
/>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `string[]` | — **required** | Array of image URLs, rendered in order with the first image on top of the stack. |
| `text` | `string` | `undefined` | Optional label shown next to the avatar pile. Omit to render avatars only. |
| `textPosition` | `"left" \| "right" \| "top" \| "bottom"` | `"right"` | Where the text sits relative to the avatar stack. |
| `avatarSize` | `number` | `40` | Width/height of each avatar in pixels. |
| `className` | `string` | `""` | Classes applied to the outer wrapping container. |
| `textClassName` | `string` | `""` | Classes applied to the text `<span>`. |

#### Notes

- Avatars overlap using a negative margin (`-space-x-3`); the **first image in the array renders on top**, since z-index is calculated as `images.length - index`.
- Each avatar scales slightly and raises above its neighbors on hover (`hover:scale-105 hover:z-10`).
- Alt text is auto-generated per image (`Subscriber user avatar profile thumbnail {n}`) — override by pre-processing your `images` array if you need custom alt text per avatar.
- Uses `next/image`, so any remote avatar host (e.g. Cloudinary, S3, Gravatar) must be added to `images.remotePatterns` in `next.config.js`.

---

### CountdownTimer

An animated countdown clock (days / hours / minutes / seconds) that counts down to a target launch date, with a rolling-digit animation on each tick.

#### Import

```tsx
import { CountdownTimer } from "@/components/countdown-timer";
```

#### Usage

```tsx
<CountdownTimer launchDate="2026-09-01T09:00:00-05:00" />
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `launchDate` | `string` | — **required** | Any string parseable by `new Date()`. **Always include a timezone offset** (e.g. `-05:00` or `Z`) — an unqualified string like `"2026-09-01"` is parsed as UTC midnight and will show the wrong local countdown. |

#### Behavior

- Client component (`'use client'`) — updates every second via `setInterval`.
- Uses `motion`'s `AnimatePresence` to animate each digit rolling in/out vertically when it changes.
- Renders a placeholder skeleton (invisible pulse block) until `isMounted` is `true`, to avoid a server/client hydration mismatch on the initial render.
- When `launchDate` has already passed, all values freeze at `00` rather than going negative.

#### Dependencies

Requires `motion`:

```bash
npm install motion
```

#### Known limitation

The component re-renders all four digit groups every second even when only `seconds` changes. For most waitlist pages this is negligible, but if you're rendering many countdowns on one page, consider memoizing or reducing tick frequency.

---

### Logo

Renders a brand logo image next to (or above/below) brand text, linking to the homepage. Pulls defaults from a shared `BRAND` config object.

#### Import

```tsx
import Logo from "@/components/logo";
```

#### Usage

```tsx
<Logo text="Waitkit" />

// Fully overridden
<Logo
  imageSrc="/custom-logo.svg"
  text="Acme"
  width={32}
  height={32}
  containerSize={8}
  textPosition="bottom"
/>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `imageSrc` | `string` | `BRAND.logo` | Logo image source. Falls back to the shared brand config. |
| `text` | `string` | `""` | Brand name text. Also used to build the image's `alt` text (`"{text} logo"`). |
| `width` | `number` | `50` | Image width in pixels. |
| `height` | `number` | `50` | Image height in pixels. |
| `textPosition` | `"left" \| "top" \| "right" \| "bottom"` | `"right"` | Position of text relative to the logo image. |
| `containerSize` | `number` | `10` | Sets the logo's wrapping div to `h-{n} w-{n}` (Tailwind spacing scale, not pixels). |
| `className` | `string` | `""` | Classes for the logo image's wrapping container. |
| `textClassName` | `string` | `""` | Classes for the brand text `<span>`. |

#### ⚠️ `containerSize` Tailwind purge issue

`containerSize` is interpolated directly into the class string:

```tsx
className={`flex h-${containerSize} w-${containerSize} ...`}
```

Tailwind's JIT compiler scans your source files for **complete, static class names** — it can't resolve a dynamically built string like `h-${containerSize}`. Unless `containerSize` is always one of a few values you've also written literally elsewhere in your codebase (so Tailwind picks them up during the scan), this class **will not be generated** and the div will silently ignore the sizing.

**Safe fix** — map the numeric prop to a static class lookup:

```tsx
const sizeMap: Record<number, string> = {
  8: "h-8 w-8",
  10: "h-10 w-10",
  12: "h-12 w-12",
  16: "h-16 w-16",
};

<div className={cn("flex items-center justify-center rounded-full shrink-0", sizeMap[containerSize] ?? sizeMap[10])}>
```

Or simpler: drop `containerSize` and size the container from `width`/`height` directly via inline `style`, matching the pattern already used in `AvatarStack`.

#### Notes

- Renders as a `next/link` wrapping a `next/image` — clicking anywhere on the logo (image or text) navigates to `/`.
- `priority` and `loading="eager"` are hardcoded, so the logo is always eagerly loaded — appropriate for above-the-fold branding, but avoid using this component for decorative/repeated logos further down a page (it'll compete with real above-the-fold priority images for load bandwidth).

---

### Badge

A small pill-shaped badge with an optional pulsing "live" indicator dot — commonly used for things like `"🟢 Now accepting signups"`.

#### Import

```tsx
import { Badge } from "@/components/badge";
```

#### Usage

```tsx
<Badge text="Now accepting signups" />

// Custom colors, no dot
<Badge text="Coming soon" showDot={false} />

// Custom dot colors
<Badge
  text="127 spots left"
  dotClassName="bg-amber-500"
  pingClassName="bg-amber-400"
/>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | — **required** | Label text shown in the badge. |
| `dotClassName` | `string` | `"bg-emerald-500"` | Background class for the static center dot. |
| `pingClassName` | `string` | `"bg-emerald-400"` | Background class for the expanding ping ring animation. |
| `showDot` | `boolean` | `true` | Set `false` to render text only, no indicator dot. |
| `className` | `string` | `undefined` | Extra classes merged onto the outer badge container. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Any other native div props (e.g. `onClick`, `id`) are spread onto the root element. |

#### Notes

- The pulsing effect is two stacked spans: an `animate-ping` ring behind a static dot, standard Tailwind pattern for a "live" indicator.
- Because `dotClassName`/`pingClassName` are passed as full literal strings (e.g. `"bg-amber-500"`) rather than built from a variable, they're **safe from the Tailwind purge issue** described above in `Logo` — as long as you always pass complete class names and never interpolate a color variable into the string.
- Extends `HTMLAttributes<HTMLDivElement>`, so it's straightforward to make the badge clickable or add `data-*` attributes without modifying the component.

---

### Input

A labeled text input with built-in error and helper-text states, accessible label/description wiring, and full support for native `<input>` props.

#### Import

```tsx
import { Input } from "@/components/input";
```

#### Usage

```tsx
<Input label="Email" type="email" placeholder="you@example.com" />

// With helper text
<Input
  label="Email"
  helperText="We'll only use this to notify you at launch."
/>

// With a validation error
<Input
  label="Email"
  error="Please enter a valid email address."
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Uncontrolled, with a ref
<Input ref={inputRef} label="Referral code" />
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `undefined` | Label rendered above the field. Omit to render an unlabeled input. |
| `error` | `string` | `undefined` | Error message shown below the field. Also switches the field and label into error styling and sets `aria-invalid="true"`. |
| `helperText` | `string` | `undefined` | Descriptive text shown below the field. **Only rendered when `error` is not set** — an error always takes visual priority over helper text. |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | Any native input prop (`type`, `value`, `onChange`, `placeholder`, `disabled`, `required`, etc.) is passed straight through. |

Also forwards a `ref` to the underlying `<input>` element (`forwardRef`), so it works with form libraries like React Hook Form (`register`) or direct DOM access.

#### Accessibility

- Generates a stable id via `useId()` if you don't pass one explicitly, and uses it to wire `<label htmlFor>` to the input.
- Sets `aria-describedby` to point at the error message or helper text (whichever is rendered), so screen readers announce it alongside the field.
- Sets `aria-invalid="true"` whenever `error` is present.

#### Notes

- The input is fully rounded (`rounded-full`) with a pill shape — pass `className="rounded-md"` (or similar) via the `className` prop if you need a more standard rectangular field; `cn()` will let your override win over the default.
- Passing both `error` and `helperText` at the same time is supported but only `error` will be visible — the component doesn't stack them. If you want both shown together, render your own subtext below the component instead of relying on `helperText`.
- `disabled` styling only dims the label (`text-foreground/20`); the input itself gets its disabled look from `disabled:opacity-50` in the base input classes.

---

### Button

A polymorphic-styled button with two visual variants, three sizes, and a built-in loading state.

#### Import

```tsx
import { Button } from "@/components/button";
```

#### Usage

```tsx
<Button>Join waitlist</Button>

<Button variant="outline" size="lg">
  Learn more
</Button>

<Button isLoading>
  Submitting
</Button>

<Button size="sm" onClick={handleClick}>
  Copy link
</Button>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "outline"` | `"primary"` | `primary` is a filled solid button using your theme's `primary` color; `outline` is transparent with a border. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Controls padding and font size. |
| `isLoading` | `boolean` | `false` | Disables the button and swaps its children for a spinner + "Loading..." text. |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Any native button prop (`onClick`, `type`, `disabled`, `form`, etc.) passes through. |

Forwards a `ref` to the underlying `<button>` element.

#### Behavior

- Setting `isLoading` automatically disables the button too (`disabled={disabled || isLoading}`) — you don't need to separately pass `disabled`.
- While loading, the button's `children` are **replaced entirely** by a spinner and the fixed string `"Loading..."` — the original button text isn't shown alongside it. If you want the original label to persist next to the spinner (e.g. `"Submitting..."` instead of a generic string), you'll need to fork the loading branch to reference `children` instead of the hardcoded text.
- Uses `active:scale-[0.98]` for a subtle press-down effect, and `hover:opacity-80` for hover feedback rather than distinct hover background colors per variant.

#### Notes

- There's no `disabled`-specific handling of the `isLoading` spinner color — the spinner uses `text-current`, so it inherits whatever text color the active `variant` sets, which stays correct in both `primary` and `outline`.
- Only two variants are defined (`primary`, `outline`) — there's no `secondary`, `ghost`, or `destructive` variant yet. Add new entries to the `variants` object if your design system needs them.
- `size="sm"` sets both a smaller padding and explicitly re-declares `font-medium`, which is already the base font weight — harmless, but redundant with the shared `font-medium` in `baseStyles`.

---

### Shared conventions across these components

- All position-style props (`textPosition`) use the same four-direction pattern (`left | right | top | bottom`) mapped to a `positionClasses` object — consistent, but note `AvatarStack` and `Logo` each define their own copy of this map rather than sharing one. If you add a fifth position or change the gap/alignment values, you'll need to update both.
- `Logo` and `Badge` import `cn` from `@/lib/utils`; `AvatarStack` also imports `cn` but `Logo` builds its top-level class string with a raw template literal instead — worth normalizing to `cn()` everywhere for consistent class-merging behavior (e.g. correctly de-duping conflicting Tailwind classes when consumers pass `className` overrides).
- `Input` and `Button` both use `forwardRef` and spread `...props`, making them drop-in compatible with form libraries (React Hook Form, Formik) and any code that needs direct DOM access.
- `Input`, `Button`, `Badge`, and `AvatarStack` are all fully rounded (`rounded-full`) by default — a consistent pill-shaped visual language across the kit. Keep this in mind if you introduce a new component; a sharp-cornered element will stand out as inconsistent unless intentional.