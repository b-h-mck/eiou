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
  const [options, setOptions] = useState<Options>({
      prefix: "$",
      suffix: "",
      decimalPlaces: 2,
      omitDecimalForWhole: true,
      defaultAmount: 20,
      stepAmount: 1,
      maxAmount: 100,
  });

  useEffect(() => {
      console.log("Fetching options from DB....");
      const fetchOptions = async () => {
          const fetchedOptions = await OptionsDB.get();
          if (fetchedOptions) {
              console.log("Fetched options:", fetchedOptions);
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