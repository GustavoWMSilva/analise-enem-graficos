import type { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  eyebrow: string;
  children: ReactNode;
}

export function ChartPanel({ title, eyebrow, children }: ChartPanelProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p>
        <h2 className="mt-1 text-base font-bold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}
