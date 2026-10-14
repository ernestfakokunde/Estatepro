'use client';

import { useMemo, useState } from 'react';
import { Calculator, Home, KeyRound } from 'lucide-react';
import { estimateHousingBudget, estimateMonthlyMortgage } from '@/lib/calculator';
import { formatNaira } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export function AffordabilityCalculator() {
  const [mode, setMode] = useState<'buy' | 'rent'>('buy');
  const [price, setPrice] = useState(150000000);
  const [downPayment, setDownPayment] = useState(30);
  const [interestRate, setInterestRate] = useState(18);
  const [termYears, setTermYears] = useState(20);
  const [income, setIncome] = useState(1500000);
  const [debts, setDebts] = useState(0);
  const monthlyCost = useMemo(
    () =>
      mode === 'buy'
        ? estimateMonthlyMortgage(price * (1 - downPayment / 100), interestRate, termYears)
        : estimateHousingBudget(income, debts),
    [mode, price, downPayment, interestRate, termYears, income, debts],
  );

  return (
    <section aria-labelledby="affordability-title" className="border border-line bg-[#f8f9f6] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="eyebrow">
            <span className="eyebrow-rule" /> PLAN YOUR NEXT MOVE
          </span>
          <h2 id="affordability-title" className="mt-3 font-display text-2xl font-medium tracking-tight">
            A clearer idea of what fits.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Explore an indicative monthly budget before you begin. A local advisor can help you review your
            options.
          </p>
        </div>
        <Calculator className="text-[#728277]" size={22} />
      </div>
      <div
        className="mt-6 inline-flex border border-line bg-white p-1"
        role="group"
        aria-label="Calculator mode"
      >
        <button
          type="button"
          aria-pressed={mode === 'buy'}
          onClick={() => setMode('buy')}
          className={`inline-flex min-h-10 items-center gap-2 px-4 text-xs font-medium ${mode === 'buy' ? 'bg-forest text-white' : 'text-muted'}`}
        >
          <Home size={14} /> Buying
        </button>
        <button
          type="button"
          aria-pressed={mode === 'rent'}
          onClick={() => setMode('rent')}
          className={`inline-flex min-h-10 items-center gap-2 px-4 text-xs font-medium ${mode === 'rent' ? 'bg-forest text-white' : 'text-muted'}`}
        >
          <KeyRound size={14} /> Renting
        </button>
      </div>
      {mode === 'buy' ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Property price"
            type="number"
            min="1"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            suffix="₦"
          />
          <Input
            label="Down payment"
            type="number"
            min="0"
            max="90"
            value={downPayment}
            onChange={(event) => setDownPayment(Math.min(90, Number(event.target.value)))}
            suffix="%"
          />
          <Input
            label="Annual interest"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={interestRate}
            onChange={(event) => setInterestRate(Number(event.target.value))}
            suffix="%"
          />
          <Input
            label="Repayment term"
            type="number"
            min="1"
            max="40"
            value={termYears}
            onChange={(event) => setTermYears(Number(event.target.value))}
            suffix="years"
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input
            label="Monthly household income"
            type="number"
            min="0"
            value={income}
            onChange={(event) => setIncome(Number(event.target.value))}
            suffix="₦ / month"
          />
          <Input
            label="Monthly debt payments"
            type="number"
            min="0"
            value={debts}
            onChange={(event) => setDebts(Number(event.target.value))}
            suffix="₦ / month"
          />
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted">
            {mode === 'buy' ? 'ESTIMATED MONTHLY MORTGAGE' : 'SUGGESTED MONTHLY RENT BUDGET'}
          </p>
          <p className="mt-2 font-display text-3xl font-medium tracking-tight">
            {formatNaira(monthlyCost)}
            <span className="ml-1 text-sm font-normal text-muted">/ month</span>
          </p>
        </div>
        <p className="max-w-sm text-[10px] leading-4 text-muted">
          Illustration only. Actual lending terms, fees, taxes, maintenance, and rental costs vary by property
          and provider.
        </p>
      </div>
    </section>
  );
}
