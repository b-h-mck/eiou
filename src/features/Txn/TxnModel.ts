import { formatCurrency, Options } from "../Settings/OptionsModel";

export type TxnType = 'iOwe' | 'theyOwe' | 'iPaid' | 'theyPaid'
export function category(type: TxnType) : 'iou' | 'pay' {
    switch (type) {
        case 'iOwe':
        case 'theyOwe':
            return 'iou';
        case 'iPaid':
        case 'theyPaid':
            return 'pay';
    }
}
export function direction(type: TxnType) : 'debit' | 'credit' {
    switch (type) {
        case 'iOwe':
        case 'theyPaid':
            return 'credit';
        case 'iPaid':
        case 'theyOwe':
            return 'debit';
    }
}

export function negateIfCredit(type: TxnType, amount: number | null): number | null {
    if (!amount) return amount;
    return direction(type) === 'credit' ? -amount : amount;
}


export type TxnEditableFields = {
    description: string;
    notes: string;
    date: string;
    fullAmount: number | null;
    splitWithMe: boolean;
};

export type Txn = TxnEditableFields & {
    id: string;
    personId?: string;
    personName?: string;
    type: TxnType;
    ledgerId: string; // Added ledgerId field
};

export type TxnCalculations = Txn & {
    finalAmount: number | null;
    balanceBefore: number | null;
    balanceAfter: number | null;
};

export type TxnCalculationsByPersonId = Record<string, TxnCalculations[]>;


export function getTxnSummary(txn: Txn, options: Options): string {
    const personName = txn.personName || 'Someone';
    let txnString = '';
    if (txn.type === 'iOwe') txnString += `I owe ${personName}`
    else if (txn.type === 'theyOwe') txnString += `${personName} owes me`;
    else if (txn.type === 'iPaid') txnString += `I paid ${personName}`;
    else if (txn.type === 'theyPaid') txnString += `${personName} paid me`;

    if (txn.fullAmount === 0) {
        txnString += ' nothing';
    }
    else if (txn.fullAmount == null) {
        txnString += ' an unknown amount';

    }
    else if (txn.fullAmount) {
        const amount = txn.splitWithMe ? (txn.fullAmount || 0) / 2 : txn.fullAmount || 0;
        txnString += amount ? ` ${formatCurrency(amount, options)}` : '';
    }


    if (txn.description) {
        txnString += ` for ${txn.description}`;
    }
    return txnString;
}

export function calculateTxns(txns: Txn[]): TxnCalculationsByPersonId {
    txns = txns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const result: TxnCalculationsByPersonId = {};
    for (const txn of txns) {
        const personId = txn.personId || 'unknown';
        if (!result[personId]) {
            result[personId] = [];
        }
        let finalAmount = txn.fullAmount;
        if (finalAmount && txn.splitWithMe) 
            finalAmount = finalAmount / 2;
        finalAmount = negateIfCredit(txn.type, finalAmount);
        
        const balanceBefore = result[personId].length > 0 ? result[personId][result[personId].length - 1].balanceAfter : 0;
        const txnWithCalculations: TxnCalculations = {
            ...txn,
            finalAmount,
            balanceBefore,
            balanceAfter: balanceBefore === null || finalAmount === null ? null : balanceBefore + finalAmount,
        };
        result[personId].push(txnWithCalculations);
    }
    return result;
}
