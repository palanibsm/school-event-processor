# School Event Processor

A mobile-friendly web app that extracts calendar events from school PDF communications using AI. Built for parents who receive event letters, exam schedules, and field trip notices as PDFs (e.g. from Singapore's ParentsGateway app) and want to quickly add them to Google Calendar.

## What It Does

1. **Upload a school PDF** from your phone or computer
2. **AI extracts structured events** - dates, times, locations, attire, things to bring, notes
3. **Tap to add to Google Calendar** - each event gets a one-tap link that opens Google Calendar with everything pre-filled
4. **Share with other parents** - tap the share icon next to any event to send the Google Calendar link via WhatsApp, Messages, or any app
5. **Download .ics file** - alternative option for importing into any calendar app

## Features

- **AI-powered extraction** using OpenAI GPT-4o vision - handles diverse PDF formats including multi-page letters, exam timetables, event posters, and field trip notices
- **Google Calendar integration** - one-tap event links with timezone support (Asia/Singapore)
- **Two reminders per event** - 1 day before and 30 minutes before (via .ics download; for Google Calendar links, see [CalendarSetup.md](CalendarSetup.md))
- **Share event links** - native share sheet on mobile, clipboard copy on desktop
- **Customizable AI prompt** - adjust the extraction instructions to your needs
- **Customizable output fields** - enable/disable fields like location, attire, things to bring
- **Inline event editing** - review and modify extracted events before adding to calendar
- **Google Sign-In** - restrict access to authorized family members only
- **Mobile-first design** - optimized for phone use, works great on desktop too

## How to Use

1. Open the app on your phone and sign in with your Google account
2. Tap **"Tap to upload a PDF"** and select a school PDF from your files
3. The PDF pages will be rendered as previews - tap **"Extract Events"**
4. Review the extracted events - expand any event card to see full details or edit them
5. At the bottom, tap any event name to **add it to Google Calendar** instantly
6. Tap the **share icon** next to an event to send the link to other parents
7. Optionally tap **"Download .ics file instead"** to get a calendar file with all events

> **First-time setup:** To get two reminders (1 day + 30 min) on events added via Google Calendar links, follow the one-time setup in [CalendarSetup.md](CalendarSetup.md).

## Deploy Your Own

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- An [OpenAI API key](https://platform.openai.com/api-keys) (GPT-4o is used for extraction)
- A [Google Cloud](https://console.cloud.google.com/) project for OAuth sign-in
- A [Vercel](https://vercel.com/) account (free tier works)
- **Google Calendar reminder setup** (one-time, on your phone) - see [CalendarSetup.md](CalendarSetup.md)

### 1. Clone and Install

```bash
git clone https://github.com/palanibsm/school-event-processor.git
cd school-event-processor
npm install
```

### 2. Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Choose **Web application** as the application type
6. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://your-app.vercel.app/api/auth/callback/google` (for production - update with your actual Vercel URL)
7. Copy the **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# OpenAI - required for PDF event extraction
OPENAI_API_KEY=sk-...your-key...

# NextAuth.js - required for Google Sign-In
AUTH_SECRET=your-random-secret
AUTH_GOOGLE_ID=123456789.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-...

# Comma-separated list of allowed Google email addresses
# Leave empty to allow anyone with a Google account
ALLOWED_EMAILS=you@gmail.com,spouse@gmail.com
```

Generate `AUTH_SECRET` by running:

```bash
npx auth secret
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel

The easiest way is to connect your GitHub repository to Vercel:

1. Push the code to your GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add the following **Environment Variables** in the Vercel project settings:
   - `OPENAI_API_KEY`
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `ALLOWED_EMAILS`
4. Deploy - Vercel will auto-deploy on every push to `master`
5. After the first deploy, go back to Google Cloud Console and add your Vercel URL to the OAuth redirect URIs:
   `https://your-app.vercel.app/api/auth/callback/google`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth API handlers
│   │   └── extract/route.ts              # PDF extraction endpoint (OpenAI)
│   ├── signin/page.tsx                   # Google Sign-In page
│   ├── layout.tsx                        # Root layout with SessionProvider
│   ├── page.tsx                          # Main app page
│   └── globals.css                       # Tailwind CSS
├── components/
│   ├── CalendarDownload.tsx              # Google Calendar links + share + .ics download
│   ├── EventCard.tsx                     # Expandable event card with inline editing
│   ├── EventList.tsx                     # Sorted list of event cards
│   ├── FormatEditor.tsx                  # Output fields toggle panel
│   ├── Header.tsx                        # App header with user avatar + sign out
│   ├── LoadingState.tsx                  # Skeleton loader during extraction
│   ├── PdfPreview.tsx                    # PDF page thumbnail strip
│   ├── PdfUploader.tsx                   # File upload with drag-and-drop
│   └── PromptEditor.tsx                  # AI prompt editor panel
├── hooks/
│   ├── useExtraction.ts                  # Extraction state machine
│   └── useSettings.ts                    # Settings persistence (localStorage)
├── lib/
│   ├── calendar.ts                       # ICS generation + Google Calendar URLs
│   ├── openai.ts                         # OpenAI GPT-4o vision API
│   ├── pdf-to-images.ts                  # Client-side PDF rendering (pdfjs-dist)
│   ├── prompts.ts                        # Default extraction prompt
│   ├── storage.ts                        # localStorage helpers
│   └── types.ts                          # TypeScript interfaces
├── auth.ts                               # NextAuth v5 config (Google + email allowlist)
└── middleware.ts                          # Route protection
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- **AI**: [OpenAI GPT-4o](https://platform.openai.com/) vision with structured outputs
- **PDF Rendering**: [pdfjs-dist](https://github.com/nickolasg/pdfjs-dist) (client-side)
- **Calendar**: [ics](https://github.com/adamgibbons/ics) for .ics generation + Google Calendar URL API
- **Auth**: [NextAuth.js](https://authjs.dev/) v5 with Google OAuth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Hosting**: [Vercel](https://vercel.com/)

## Cost Considerations

- **OpenAI API**: GPT-4o vision costs ~$0.01-0.05 per PDF extraction depending on page count. A typical family's usage (a few PDFs per week) costs under $1/month.
- **Vercel**: Free tier (Hobby plan) is sufficient for personal/family use.
- **Google Cloud**: OAuth is free for personal use.
