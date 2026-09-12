# DevTinder — Frontend

The React client for **DevTinder** — a Tinder-style networking platform where developers discover, connect, and chat with each other based on skills and interests.

🔗 **Live App:** [http://3.26.26.82](http://3.26.26.82)
🔗 **Backend Repo:** [DevTinder-Backend](https://github.com/Anu1606-dev/DevTinder-Backend)

---

## What This Is

A fully responsive, real-time single-page application built on top of the Namaste Node.js course architecture and extended well beyond it — with a polished WhatsApp-style chat experience, live payment flow, custom theming, and production deployment on AWS.

---

## Features

### Core Experience
- Swipeable developer discovery feed with skill/bio previews
- Connection request flow (send, accept, reject)
- Profile editing with photo, bio, age, gender, and skills
- Light/dark theme toggle with persisted preference

### Real-Time Chat
- WhatsApp-style chat list showing latest message preview, sender attribution ("You: ..."), and unread counts
- Live messaging via Socket.io — no refresh needed
- Persistent unread badges backed by real database state (not just local session memory)
- Sender/receiver avatars inline with each message bubble

### Payments
- Razorpay Checkout integration for Premium membership
- Client-side payment verification flow with backend signature confirmation

### Polish
- Custom animated focus states across all form inputs
- Fully responsive navbar, footer, and layouts down to small mobile viewports
- Toast notifications and confirmation modals for key actions (logout, etc.)
- Dedicated Contact Us page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| State Management | Redux Toolkit |
| Routing | React Router |
| Styling | Tailwind CSS, daisyUI |
| HTTP Client | Axios |
| Real-time | Socket.io-client |
| Payments | Razorpay Checkout.js |

---

## Architecture Notes

- API calls and the Socket.io connection use **separate base URLs** (`VITE_API_BASE_URL` and `VITE_SOCKET_URL`), since the production Nginx config proxies REST traffic under a `/api` path prefix while Socket.io requires its own dedicated proxy path with WebSocket upgrade headers.
- A global `SocketProvider` (React Context) maintains a single persistent socket connection app-wide, rather than opening a new connection per page — this is what allows the navbar's unread chat badge to update live regardless of which page the user is currently viewing.
- Unread message counts are hydrated from the backend on login (not just tracked in-memory), so they survive page refreshes.

---

## Getting Started Locally

```bash
git clone https://github.com/Anu1606-dev/DevTinder-Frontend.git
cd DevTinder-Frontend
npm install
```

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:7777
VITE_SOCKET_URL=http://localhost:7777
VITE_RAZORPAY_KEY_ID=
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Roadmap

Actively being extended beyond the base course curriculum:

- [ ] AI-powered skill-matching & auto-generated chat icebreakers
- [ ] GitHub OAuth-based developer identity verification badges
- [ ] Search by name/skill
- [ ] Report & moderation UI
- [ ] Profile "Boost" and premium analytics dashboard
- [ ] Referral & engagement features

---

## Author

**Anushka Sarkar**
[GitHub](https://github.com/Anu1606-dev) · [LinkedIn](https://www.linkedin.com/in/anushka-sarkar-07b2502b9/) · [X/Twitter](https://x.com/Anu35473)