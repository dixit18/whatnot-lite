# CONTRACT — whatnot-lite

## Stack
Vite React + Tailwind + tweakcn hype theme + framer-motion. Express API in `src/`. Atlas `whatnot_prod/dev`.

## Scope (P3)
Async lots (live video via Livekit in P4). No blind-box/breaks (gambling law).

## API
- GET /health, GET /api/shows, POST /api/shows, GET /api/shows/:id
- POST /api/shows/:id/lots, POST /api/lots/:id/bid (floor = max(start, top+1)), POST /api/lots/:id/close → escrow order

## Collections
shows, lots(showId,label,startPrice,topBid,topBidder,closed), bids, orders(status escrow default).
Seed: 1 sneaker show + 2 lots.

## US check
Whatnot loop imitated (urgency, protection, seller tool), copy rewritten, lite + Hindi + UPI caps added.
