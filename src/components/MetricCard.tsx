import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}

export function MetricCard({ label, value, helper, icon }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1.5 text-xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
      <p className="mt-2 text-xs leading-4 text-slate-600">{helper}</p>
    </article>
  );
}
