export type TxnEditableFields = {
    description: string;
    notes: string;
    date: string;
    fullAmount: number | null;
    splitWithMe: boolean;
};

export type Txn = TxnEditableFields & {
    id?: string;
    personId?: string;
    personName?: string;
    direction : 'in' | 'out';
    type: 'iou' | 'pay';
};


export function getTxnSummary(txn: Txn): string {
    const personName = txn.personName || 'Someone';
    let txnString = '';
    const amount = txn.fullAmount && txn.splitWithMe ? txn.fullAmount / 2 : txn.fullAmount;
    if (txn.type === 'iou') {
        txnString += txn.direction === 'in' ? `${personName} owes me` : `I owe ${personName}`;
    } else {
        txnString += txn.direction === 'in' ? `${personName} paid me` : `I paid ${personName}`;
    }
    txnString += amount ? ` $${amount}` : '';
    if (amount) {
    }
    if (txn.description) {
        txnString += ` for ${txn.description}`;
    }
    return txnString;
}