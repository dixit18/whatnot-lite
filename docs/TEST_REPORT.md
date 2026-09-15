# TEST REPORT — whatnot-lite P3 MVP (2026-09-14, test agent)

## API (live, memory mode)
- [x] GET /health → {ok, app}
- [x] GET /api/shows → 1 seed show
- [x] POST /api/lots/lot0/bid 8500 → top 8500 Tester1
- [x] Low bid 8000 → 400 floor reject
- [x] POST /api/lots/lot0/close → escrow order Tester1 Rs.8500

## UI static
- [x] 360/768/1440, 44px targets, hype yellow/black theme, framer home, Hindi toggle

## Pending P4
- [ ] client `vite build`, Livekit video, Razorpay escrow, fake-check, Lighthouse >85, Atlas whatnot_prod
