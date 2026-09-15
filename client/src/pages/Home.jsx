import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { shows } from '../lib/api.js';
import { STR } from '../lib/i18n.js';
import { Card } from '../components/ui.jsx';

export default function Home({ lang, setLang }) {
  const t = STR[lang];
  const [items, setItems] = useState([]);
  useEffect(() => { shows().then(setItems).catch(() => {}); }, []);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-end"><button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="text-sm underline min-h-[44px]">{lang === 'en' ? 'Hindi' : 'English'}</button></div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <p className="inline-block text-sm font-extrabold bg-[hsl(var(--primary))] border-2 border-black px-3 py-1">{t.tag}</p>
        <h1 className="text-4xl sm:text-6xl font-black mt-3">{t.hero}</h1>
        <p className="mt-3 max-w-xl">{t.sub}</p>
      </motion.div>
      <div className="grid gap-3 sm:grid-cols-2 mt-6">
        {items.map((s) => (
          <Link key={s._id} to={`/s/${s._id}`}><Card><p className="font-extrabold">{s.title}</p><p className="text-sm">by {s.seller} · {s.category} {s.live ? '· LIVE' : ''}</p></Card></Link>
        ))}
        {items.length === 0 && <p className="text-sm">No live shows — seed show loads from API.</p>}
      </div>
    </div>
  );
}
