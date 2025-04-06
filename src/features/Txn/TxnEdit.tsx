import { useState } from 'react';
import { category, getTxnSummary, Txn, TxnEditableFields, TxnType } from './TxnModel';
import './TxnEdit.css';

interface TxnEditProps {
    personName?: string;
    type: TxnType;
    txn: TxnEditableFields;
    onChange: (txn: TxnEditableFields) => void;
    onSave: (txn: TxnEditableFields) => void;
    onCancel: () => void;
}

const TxnEdit = (props: TxnEditProps) => {
    const [txn, setTxn] = useState<TxnEditableFields>(props.txn);
    const [unknownAmount, setUnknownAmount] = useState(props.txn.fullAmount === null);
    const [splitWithMe, setSplitWithMe] = useState(props.txn.splitWithMe);
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
            handleChange('fullAmount', null);
        } else {
            handleChange('fullAmount', previousAmount);
        }
    };

    const handleSplitWithMeChange = (checked: boolean) => {
        setSplitWithMe(checked);
        handleChange('splitWithMe', checked);
    };
    const activeTxn : Txn = { ...txn, id: '0', personName: props.personName, type: props.type };
    let isSaveDisabled = !unknownAmount && (txn.fullAmount === null || txn.fullAmount === undefined);
    isSaveDisabled = isSaveDisabled || !props.personName;

    return (
        <div className="txn-edit">
            <p>{getTxnSummary(activeTxn)}</p>
            <form>
                {category(props.type) == 'iou' && (
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
                <label>
                    Amount:
                    <input
                        type="number"
                        value={
                            unknownAmount
                                ? ''
                                : txn.fullAmount ?? ''
                        }
                        onChange={(e) => handleChange('fullAmount', e.target.value ? parseFloat(e.target.value) : null)}
                        disabled={unknownAmount}
                    />
                </label>
                {category(props.type) == 'iou' && (
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