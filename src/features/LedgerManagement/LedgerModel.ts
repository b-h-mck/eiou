import { Options } from "../Settings/OptionsModel";
import { LedgersDB } from "../../shared/store";

export type Ledger = {
  id: string;
  name: string;
  currencyOptions: Options;
};

export const createLedger = async (name: string, currencyOptions: Options): Promise<Ledger> => {
  const ledger: Ledger = {
    id: crypto.randomUUID(),
    name,
    currencyOptions,
  };
  await LedgersDB.put(ledger);
  return ledger;
};

export const updateLedger = async (ledger: Ledger): Promise<void> => {
  await LedgersDB.put(ledger);
};

export const deleteLedger = async (id: string): Promise<void> => {
  await LedgersDB.delete(id);
};

export const getLedger = async (id: string): Promise<Ledger | undefined> => {
  return await LedgersDB.get(id);
};

export const getAllLedgers = async (): Promise<Ledger[]> => {
  return await LedgersDB.getAll();
};
