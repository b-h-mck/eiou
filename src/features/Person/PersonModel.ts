import { TxnCalculationsByPersonId } from "../Txn/TxnModel";
import { OptionsDB } from "../../shared/store";
import { formatCurrency, Options } from "../Settings/OptionsModel";

export type PersonEditableFields = {
    name : string;
    openingBalance: number;
};

export type Person = PersonEditableFields & {
    id: string;
};

export type PersonCalculations = Person & {
    closingBalance: number | null;
};


export function calculatePeople(people: Person[], txnsByPersonId: TxnCalculationsByPersonId): PersonCalculations[] {
    const calculatedPeople = people.map((person) => {
        let closingBalance : number | null = null;
        let personTxns = person?.id ? txnsByPersonId[person.id] : undefined;
        if (personTxns && personTxns.length > 0) {
            closingBalance = personTxns.slice(-1)[0].balanceAfter;
        } else {
            closingBalance = person.openingBalance;
        }
        return { ...person, closingBalance };
    });
    return calculatedPeople;
}

export async function getBalanceString(personName: string, balance: number | null): Promise<string> {
    const options = await OptionsDB.get() || {
        prefix: "",
        suffix: "",
        decimalPlaces: 2,
        omitDecimalForWhole: false,
        defaultAmount: 20,
        stepAmount: 1,
        maxAmount: 100,
    };

    if (balance === null) {
        return 'Balance is unknown';
    }
    if (balance === 0) {
        return 'We are square';
    }
    const absBalance = Math.abs(balance);
    if (balance > 0) {
        return `${personName} owes ${formatCurrency(absBalance, options)}`;
    }
    return `I owe ${formatCurrency(absBalance, options)}`;
}
