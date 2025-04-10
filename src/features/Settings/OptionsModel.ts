export type Options = {
  prefix: string;
  suffix: string;
  decimalPlaces: number;
  omitDecimalForWhole: boolean;
  defaultAmount: number;
  stepAmount: number;
  maxAmount: number;
};

export const defaultOptions: Options = {
  prefix: "",
  suffix: "",
  decimalPlaces: 2,
  omitDecimalForWhole: false,
  defaultAmount: 20,
  stepAmount: 1,
  maxAmount: 100,
};

export function formatCurrency(amount: number, options: Options): string {
  const { prefix, suffix, decimalPlaces, omitDecimalForWhole } = options;

  let formattedAmount = amount.toFixed(decimalPlaces);

  if (omitDecimalForWhole && amount % 1 === 0) {
    formattedAmount = amount.toFixed(0);
  }

  return `${prefix}${formattedAmount}${suffix}`;
}
