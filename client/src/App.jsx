import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ShowPage from './pages/ShowPage.jsx';

export default function App() {
  const [lang, setLang] = useState('en');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
        <Route path="/s/:id" element={<ShowPage lang={lang} />} />
      </Routes>
    </BrowserRouter>
  );
}
