export function estimateMonthlyMortgage(principal: number, annualRate: number, termYears: number) {
  if (principal <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const payments = termYears * 12;
  if (monthlyRate === 0) return principal / payments;
  const factor = (1 + monthlyRate) ** payments;
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

export function estimateHousingBudget(monthlyIncome: number, monthlyDebt: number) {
  return Math.max(0, monthlyIncome * 0.3 - monthlyDebt);
}
