import { useEffect, useState } from "react";
import { OptionsDB } from "../../shared/store";

export type Options = {
  prefix: string;
  suffix: string;
  decimalPlaces: number;
  omitDecimalForWhole: boolean;
  defaultAmount: number;
  stepAmount: number;
  maxAmount: number;
};

export function formatCurrency(amount: number, options: Options): string {
  const { prefix, suffix, decimalPlaces, omitDecimalForWhole } = options;

  let formattedAmount = amount.toFixed(decimalPlaces);

  if (omitDecimalForWhole && amount % 1 === 0) {
    formattedAmount = amount.toFixed(0);
  }

  return `${prefix}${formattedAmount}${suffix}`;
}

export const useOptions = () => {
  const [options, setOptions] = useState<Options>({prefix: "", suffix: "", decimalPlaces: 0, omitDecimalForWhole: false, defaultAmount: 0, stepAmount: 0, maxAmount: 0});

  useEffect(() => {
      console.log("Fetching options from DB....");
      const fetchOptions = async () => {
          const fetchedOptions = await OptionsDB.get();
          console.log("Options fetched from DB.", fetchedOptions);
          setOptions(fetchedOptions);
      };
      fetchOptions();
  }, []);

  return options;
};