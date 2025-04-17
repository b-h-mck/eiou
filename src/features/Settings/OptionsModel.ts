import { useEffect, useState } from "react";
import { OptionsDB } from "../../shared/store";

export type Options = {
  activeLedgerId: string;
};

export type CurrencyOptions = {
  prefix: string;
  suffix: string;
  decimalPlaces: number;
  omitDecimalForWhole: boolean;
  defaultAmount: number;
  stepAmount: number;
  maxAmount: number;
};

export function formatCurrency(amount: number, currencyOptions: CurrencyOptions): string {
  const { prefix, suffix, decimalPlaces, omitDecimalForWhole } = currencyOptions;

  let formattedAmount = amount.toFixed(decimalPlaces);

  if (omitDecimalForWhole && amount % 1 === 0) {
    formattedAmount = amount.toFixed(0);
  }

  return `${prefix}${formattedAmount}${suffix}`;
}

export const defaultCurrencyOptions: CurrencyOptions = {
  prefix: "$",
  suffix: "",
  decimalPlaces: 2,
  omitDecimalForWhole: true,
  defaultAmount: 20,
  stepAmount: 1,
  maxAmount: 100,
};

export const useOptions = () => {
  const [options, setOptions] = useState<Options | null>(null);

  useEffect(() => {
      const fetchOptions = async () => {
          const fetchedOptions = await OptionsDB.get();
          if (fetchedOptions) {
            setOptions(fetchedOptions);
          }
          else {
              console.log("No options found in DB, using default options.");
          }
      };
      fetchOptions();
  }, []);

  return options;
};
