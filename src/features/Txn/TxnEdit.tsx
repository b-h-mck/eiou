import { useState } from 'react';
import { getTxnSummary, TxnEditableFields } from './TxnModel';
import './TxnEdit.css';

interface TxnEditProps {
    personName?: string;
    direction: 'in' | 'out';
    type: 'iou' | 'pay';
    txn: TxnEditableFields;
    remainingBalance?: number;
    onChange: (txn: TxnEditableFields) => void;
    onSave: (txn: TxnEditableFields) => void;
    onCancel: () => void;
}

const TxnEdit = (props: TxnEditProps) => {
    const [txn, setTxn] = useState<TxnEditableFields>(props.txn);
    const [unknownAmount, setUnknownAmount] = useState(false);
    const [remainingBalanceChecked, setRemainingBalanceChecked] = useState(false);
    const [splitWithMe, setSplitWithMe] = useState(false);
    const [previousAmount, setPreviousAmount] = useState<number | null>(txn.fullAmount);

    const handleChange = (field: keyof TxnEditableFields, value: string | number | boolean | null) => {
        const updatedTxn = { ...txn, [field]: value };
        setTxn(updatedTxn);
        props.onChange(updatedTxn);
    };

    const handleSave = () => {
        props.onSave(txn);
    };

    const handleUnknownAmountChange = (checked: boolean) => {
        setUnknownAmount(checked);
        if (checked) {
            setPreviousAmount(txn.fullAmount);
            handleChange('fullAmount', null); // Blank and disable Amount
        } else {
            handleChange('fullAmount', previousAmount); // Restore previous value
        }
    };

    const handleRemainingBalanceChange = (checked: boolean) => {
        setRemainingBalanceChecked(checked);
        if (checked) {
            setPreviousAmount(txn.fullAmount);
            handleChange('fullAmount', props.remainingBalance ?? 123); // Set to remaining balance
        } else {
            handleChange('fullAmount', previousAmount); // Restore previous value
        }
    };

    const handleSplitWithMeChange = (checked: boolean) => {
        setSplitWithMe(checked);
        handleChange('splitWithMe', checked);
    };

    const isSaveDisabled = !unknownAmount && (txn.fullAmount === null || txn.fullAmount === undefined);

    return (
        <div className="txn-edit">
            <p>{getTxnSummary({ ...txn, personName: props.personName, direction: props.direction, type: props.type })}</p>
            <form>
                {props.type === 'iou' && (
                    <div className="checkbox-row">
                        <input
                            type="checkbox"
                            id="unknownAmount"
                            checked={unknownAmount}
                            onChange={(e) => handleUnknownAmountChange(e.target.checked)}
                        />
                        <label htmlFor="unknownAmount">Unknown Amount</label>
                    </div>
                )}
                {props.type === 'pay' && (
                    <div className="checkbox-row">
                        <input
                            type="checkbox"
                            id="remainingBalance"
                            checked={remainingBalanceChecked}
                            onChange={(e) => handleRemainingBalanceChange(e.target.checked)}
                        />
                        <label htmlFor="remainingBalance">Remaining Balance</label>
                    </div>
                )}
                <label>
                    Amount:
                    <input
                        type="number"
                        value={
                            unknownAmount
                                ? ''
                                : remainingBalanceChecked
                                ? props.remainingBalance ?? 123
                                : txn.fullAmount ?? ''
                        }
                        onChange={(e) => handleChange('fullAmount', e.target.value ? parseFloat(e.target.value) : null)}
                        disabled={unknownAmount || remainingBalanceChecked}
                    />
                </label>
                {props.type === 'iou' && (
                    <div className="checkbox-row">
                        <input
                            type="checkbox"
                            id="splitWithMe"
                            checked={splitWithMe}
                            onChange={(e) => handleSplitWithMeChange(e.target.checked)}
                        />
                        <label htmlFor="splitWithMe">Split With Me</label>
                    </div>
                )}
                <label>
                    Description:
                    <input
                        type="text"
                        value={txn.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        value={txn.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                    />
                </label>
                <label>
                    Notes:
                    <textarea
                        value={txn.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                    />
                </label>
                <div className="txn-edit-buttons">
                    <button type="button" onClick={handleSave} disabled={isSaveDisabled}>
                        Save
                    </button>
                    <button type="button" onClick={props.onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TxnEdit;