# DevTinder — Frontend

The React client for **DevTinder** — a Tinder-style networking platform where developers discover, connect, and chat with each other based on real skills, GitHub-verified identity, and AI-flavored matching.
---

🔗 **Live App:** [http://3.26.26.82](http://3.26.26.82)
🔗 **Backend Repo:** [DevTinder-Backend](https://github.com/Anu1606-dev/DevTinder-Backend)

---

## Screenshots

- [ ] Feed page showing a swipe card with a **match % badge** and skills visible
- [ ] Edit Profile page showing the GitHub "Verified" badge + repo/language stats
- [ ] Chat page mid-conversation, showing avatars and the "Suggest an icebreaker" button
- [ ] ChatList page showing unread badges and "You: ..." message previews
- [ ] Razorpay checkout popup mid-payment (test mode is fine to show)
- [ ] Premium page showing the Boost button and Analytics stats
- [ ] Profile page showing the Achievements/badges row and Referral link card
- [ ] Admin Reports page (blur out any real user data if needed)
- [ ] Mobile-width screenshot of the navbar + feed, to demonstrate responsiveness

```
![Feed with AI match scoring](./screenshots/feed-match-score.png)
![GitHub verified profile](./screenshots/github-verified.png)
![Real-time chat with icebreaker](./screenshots/chat-icebreaker.png)
![Premium analytics dashboard](./screenshots/premium-analytics.png)
![Referral and achievements](./screenshots/referral-badges.png)
```

---

## What This Is

A fully responsive, real-time single-page application built on top of the Namaste Node.js course architecture and extended well beyond it — with GitHub-verified profiles, skill-based match scoring, a WhatsApp-style chat experience, live payments with a real Premium tier, moderation tooling, and referral-driven growth mechanics.

---

## Features

### Core Experience
- Swipeable developer discovery feed, ranked by skill-match percentage
- Connection request flow (send, accept, reject)
- Profile editing with a searchable, canonical skills picker (prevents free-text data inconsistencies)
- Light/dark theme toggle with persisted preference

### Developer Identity Verification
- One-click "Connect GitHub" flow via OAuth
- Displays real public repo count and top languages once connected
- Verified badge shown across Feed, Requests, and Connections cards

### AI-Flavored Matching
- Live match-percentage badge on every profile card
- "Suggest an icebreaker" button in new chats, referencing genuinely shared skills

### Real-Time Chat
- WhatsApp-style chat list: latest message preview, "You: ..." sender attribution, unread counts backed by real database state
- Live messaging via Socket.io — no refresh needed
- Sender/receiver avatars inline with each message bubble
- In-chat "Report" button for trust & safety

### Monetization
- Razorpay Checkout integration for Premium membership
- Premium-only "Boost" button and a profile-view analytics dashboard

### Growth & Engagement
- Shareable referral link with live copy-to-clipboard
- Real-time toast notifications the moment someone joins via your link
- Gamified achievement badges based on connection milestones

### Trust & Safety
- Report modal accessible from any chat
- Admin-only moderation dashboard (role-gated)

### Polish
- Custom animated focus states across all form inputs
- Fully responsive navbar, footer, and layouts down to small mobile viewports
- Toast notifications and confirmation modals for key actions

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

- API calls and the Socket.io connection use **separate base URLs** (`VITE_API_BASE_URL` and `VITE_SOCKET_URL`), since production Nginx proxies REST traffic under a `/api` path prefix while Socket.io requires its own dedicated proxy path with WebSocket upgrade headers.
- A global `SocketProvider` (React Context) maintains a single persistent socket connection app-wide — this is what allows both the chat unread badge *and* referral-bonus toasts to fire live regardless of which page the user is currently on.
- The skills input is a constrained picker rather than free text, specifically to guarantee that match-scoring logic (which relies on exact string comparison) stays reliable across all users' profiles.

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

- [ ] Search by name/skill
- [ ] Vector-embedding-based semantic matching
- [ ] Presence indicators ("online now")
- [ ] Message pagination in chat history

---

## Author

**Anushka Sarkar**
[GitHub](https://github.com/Anu1606-dev) · [LinkedIn](https://www.linkedin.com/in/anushka-sarkar-07b2502b9/) · [X/Twitter](https://x.com/Anu35473)