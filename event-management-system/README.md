# EventMate - Event Management System

EventMate is a responsive React event discovery and registration application built
for Web Programming Assignment 2. It uses Ticketmaster Discovery API data and
simulates authentication entirely in the browser.

## Features

- User registration, login, logout, and persistent sessions using localStorage
- Ticketmaster-powered upcoming event discovery
- Keyword search, category chips, city filtering, and date filtering
- Event cards with images, dates, venues, locations, and categories
- Detailed event pages with Ticketmaster links
- Per-user event registration with duplicate prevention
- Registration cancellation
- My Events dashboard split into upcoming and completed events
- Protected routes for event pages and the personal dashboard
- Redux Toolkit slices for authentication, events, and registrations
- Responsive layout for desktop, tablet, and mobile screens

## Requirements

- Node.js 18 or newer
- A Ticketmaster Discovery API Consumer Key

Create a key through the [Ticketmaster Developer Portal](https://developer.ticketmaster.com/).
The Consumer Key is used as the Discovery API `apikey` query parameter.

## Local setup

From the project directory:

```bash
npm install
```

Create a local `.env` file by copying `.env.example`, then add your own key:

```env
VITE_TM_API_KEY=your_ticketmaster_consumer_key
```

Never commit `.env` or a real API key. The repository ignores local environment
files and contains only a placeholder in `.env.example`.

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, register an account, and begin exploring
events. The app stores simulated users, the active session, and registrations in
the browser's localStorage.

## Available scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Routes

- `/login` - Sign in
- `/register` - Create an account
- `/events` - Search and browse upcoming events
- `/events/:id` - View event details and register/cancel
- `/my-events` - View personal upcoming and completed events

## Project structure

```text
src/
  app/store.js                    Redux store configuration
  components/                    Reusable navigation, cards, forms, and guards
  features/auth/authSlice.js      Authentication and session state
  features/events/eventsSlice.js  Ticketmaster loading state and async thunks
  features/registrations/         User-specific registration state
  pages/                          Routed application screens
  services/ticketmaster.js        Discovery API client
```

## API and quota note

The app uses Ticketmaster Discovery API v2 event, event detail, and
classification endpoints. Ticketmaster applies request quotas and rate limits,
so avoid repeatedly refreshing the page while testing. If the API key is
missing or a request fails, the interface displays an actionable error message.

## Git history

The project is developed in feature commits rather than one final snapshot:
authentication/environment setup, the Ticketmaster data layer, persistent
registrations, and the event management UI are recorded separately.
