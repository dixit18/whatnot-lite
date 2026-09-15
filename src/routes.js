import { Router } from 'express';
import { z } from 'zod';
import { Show, Lot, Bid, Order } from './models.js';
import mongoose from 'mongoose';

const r = Router();
const dbOn = () => mongoose.connection.readyState === 1;
const mem = {
  shows: [{ _id: 'show0', title: 'Sneaker Sunday — Jordan + Dunk', seller: 'DeccanKicks', category: 'sneakers', live: true }],
  lots: [
    { _id: 'lot0', showId: 'show0', label: 'Jordan 1 Mid UK9', startPrice: 8000, topBid: 0, topBidder: '', closed: false },
    { _id: 'lot1', showId: 'show0', label: 'Dunk Low UK8', startPrice: 6000, topBid: 0, topBidder: '', closed: false },
  ],
  bids: [],
  orders: [],
};

r.get('/shows', async (req, res) => {
  if (!dbOn()) return res.json({ items: mem.shows, mode: 'memory' });
  res.json({ items: await Show.find({ live: true }).sort({ createdAt: -1 }).limit(50).lean() });
});

r.post('/shows', async (req, res) => {
  const p = z.object({ title: z.string().min(3).max(80), seller: z.string().min(2).max(40), category: z.enum(['sneakers', 'cards', 'thrift', 'coins']).optional().default('sneakers') }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues });
  if (!dbOn()) {
    const s = { _id: String(Date.now()), live: true, ...p.data };
    mem.shows.push(s);
    return res.status(201).json({ item: s, mode: 'memory' });
  }
  res.status(201).json({ item: await Show.create(p.data) });
});

r.get('/shows/:id', async (req, res) => {
  if (!dbOn()) {
    const s = mem.shows.find((x) => x._id === req.params.id);
    if (!s) return res.status(404).json({ error: 'not found' });
    const lots = mem.lots.filter((l) => l.showId === s._id);
    return res.json({ item: s, lots, mode: 'memory' });
  }
  const item = await Show.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json({ item, lots: await Lot.find({ showId: item._id }).lean() });
});

r.post('/shows/:id/lots', async (req, res) => {
  const p = z.object({ label: z.string().min(2).max(80), startPrice: z.number().min(1).max(500000) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues });
  if (!dbOn()) {
    const l = { _id: 'lot' + Date.now(), showId: req.params.id, topBid: 0, topBidder: '', closed: false, ...p.data };
    mem.lots.push(l);
    return res.status(201).json({ item: l, mode: 'memory' });
  }
  const sh = await Show.findById(req.params.id);
  if (!sh) return res.status(404).json({ error: 'show not found' });
  res.status(201).json({ item: await Lot.create({ showId: sh._id, ...p.data }) });
});

r.post('/lots/:id/bid', async (req, res) => {
  const p = z.object({ bidder: z.string().min(2).max(40), amount: z.number().min(1).max(500000) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues });
  if (!dbOn()) {
    const l = mem.lots.find((x) => x._id === req.params.id);
    if (!l || l.closed) return res.status(404).json({ error: 'lot not open' });
    const floor = Math.max(l.startPrice, l.topBid + 1);
    if (p.data.amount < floor) return res.status(400).json({ error: `bid >= ${floor}` });
    l.topBid = p.data.amount;
    l.topBidder = p.data.bidder;
    mem.bids.push({ lotId: l._id, ...p.data });
    return res.status(201).json({ topBid: l.topBid, topBidder: l.topBidder, mode: 'memory' });
  }
  const l = await Lot.findById(req.params.id);
  if (!l || l.closed) return res.status(404).json({ error: 'lot not open' });
  const floor = Math.max(l.startPrice, l.topBid + 1);
  if (p.data.amount < floor) return res.status(400).json({ error: `bid >= ${floor}` });
  l.topBid = p.data.amount;
  l.topBidder = p.data.bidder;
  await l.save();
  await Bid.create({ lotId: l._id, ...p.data });
  res.status(201).json({ topBid: l.topBid, topBidder: l.topBidder });
});

r.post('/lots/:id/close', async (req, res) => {
  if (!dbOn()) {
    const l = mem.lots.find((x) => x._id === req.params.id);
    if (!l || l.closed) return res.status(404).json({ error: 'lot not open' });
    l.closed = true;
    const o = { _id: 'ord' + Date.now(), lotId: l._id, winner: l.topBidder, amount: l.topBid, status: 'escrow' };
    mem.orders.push(o);
    return res.json({ order: o, mode: 'memory' });
  }
  const l = await Lot.findById(req.params.id);
  if (!l || l.closed) return res.status(404).json({ error: 'lot not open' });
  l.closed = true;
  await l.save();
  res.json({ order: await Order.create({ lotId: l._id, winner: l.topBidder, amount: l.topBid }) });
});

export default r;
