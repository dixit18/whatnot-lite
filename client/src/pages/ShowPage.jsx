import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { show, bid, closeLot } from '../lib/api.js';
import { STR } from '../lib/i18n.js';
import { Btn, Card } from '../components/ui.jsx';

export default function ShowPage({ lang }) {
  const t = STR[lang];
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [me, setMe] = useState('Bidder1');
  const [amt, setAmt] = useState({});
  const [msg, setMsg] = useState('');
  const load = () => show(id).then(setD).catch(() => {});
  useEffect(load, [id]);
  if (!d) return <p className="p-8">Loading…</p>;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 grid gap-3">
      <Card><h1 className="text-2xl font-black">{d.item.title}</h1><p className="text-sm">by {d.item.seller}</p></Card>
      <input value={me} onChange={(e) => setMe(e.target.value)} placeholder="Bidder name" className="min-h-[44px] rounded-xl border-2 border-black px-4 bg-transparent" />
      {msg && <p className="text-sm font-bold">{msg}</p>}
      {d.lots.map((l) => (
        <Card key={l._id}>
          <p className="font-extrabold">{l.label}</p>
          <p className="text-sm">Start Rs.{l.startPrice} · Top Rs.{l.topBid || '—'} {l.topBidder ? `(${l.topBidder})` : ''} {l.closed ? '· CLOSED' : ''}</p>
          {!l.closed && (
            <div className="flex gap-2 mt-2">
              <input type="number" value={amt[l._id] || ''} onChange={(e) => setAmt({ ...amt, [l._id]: Number(e.target.value) })} placeholder="Amount" className="flex-1 min-h-[44px] rounded-xl border-2 border-black px-3 bg-transparent" />
              <Btn onClick={async () => { try { const r = await bid(l._id, { bidder: me, amount: amt[l._id] }); setMsg(`Top Rs.${r.topBid} by ${r.topBidder}`); load(); } catch (e) { setMsg(e.response?.data?.error || 'bid failed'); } }}>{t.bid}</Btn>
            </div>
          )}
          {!l.closed && l.topBid > 0 && <button onClick={async () => { const r = await closeLot(l._id); setMsg(`Escrow order ${r.order._id} for ${r.order.winner}`); load(); }} className="text-xs underline mt-2 min-h-[44px]">{t.close}</button>}
        </Card>
      ))}
    </div>
  );
}
