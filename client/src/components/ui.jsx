import React from 'react';
export const card = 'rounded-2xl border-2 border-black bg-[hsl(var(--card))] p-5 shadow-[4px_4px_0_#000]';
export const btn = 'min-h-[44px] inline-flex items-center justify-center rounded-xl px-5 font-extrabold bg-[hsl(var(--primary))] text-black border-2 border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[4px_4px_0_#000]';
export function Card(props) { return <div {...props} className={card + ' ' + (props.className || '')} />; }
export function Btn(props) { return <button {...props} className={btn + ' ' + (props.className || '')} />; }
