import { useState } from 'react';
import { category, getTxnSummary, TxnEditableFields, TxnType } from './TxnModel';
import './TxnEdit.css';
import { formatCurrency, useOptions } from '../Settings/OptionsModel';

interface TxnEditProps {
    personName?: string;
    type: TxnType;
    txn: TxnEditableFields;
    isEditingExistingTxn: boolean;
    currentBalance?: number;
    onChange: (txn: TxnEditableFields) => void;
    onSave: (txn: TxnEditableFields) => void;
    onCancel: () => void;
}

const TxnEdit = (props: TxnEditProps) => {

    const [unknownAmount, setUnknownAmount] = useState(category(props.type) == 'iou' && props.txn.fullAmount === null);
    const [splitWithMe, setSplitWithMe] = useState(props.txn.splitWithMe);
    const [previousAmount, setPreviousAmount] = useState<number | null>(props.txn.fullAmount);
    
    const options = useOptions()

    const handleChange = (field: keyof TxnEditableFields, value: string | number | boolean | null) => {
        const updatedTxn = { ...props.txn, [field]: value };
        props.onChange(updatedTxn);
    };

    const handleSave = () => {
        props.onSave(props.txn);
    };

    const handleUnknownAmountChange = (checked: boolean) => {
        setUnknownAmount(checked);
        if (checked) {
            setPreviousAmount(props.txn.fullAmount);
            handleChange('fullAmount', null);
        } else {
            handleChange('fullAmount', previousAmount);
        }
    };

    const handleSplitWithMeChange = (checked: boolean) => {
        setSplitWithMe(checked);
        handleChange('splitWithMe', checked);
    };

    let isSaveDisabled = !unknownAmount && (props.txn.fullAmount === null || props.txn.fullAmount === undefined);
    isSaveDisabled = isSaveDisabled || !props.personName;

    let title: string = '';
    let subtitle: string = '';
    let showForm: boolean = true;
    let maxSliderAmount: number = options.maxAmount;
    if (category(props.type) == 'pay') {
        if (props.isEditingExistingTxn) {
            title = props.type === 'iPaid' ? `I paid ${props.personName}` : `${props.personName} paid me`;
        }
        else if (props.currentBalance === 0) {
            title = `${props.personName} and I are currently square.`;
            subtitle = `There is no debt to be repaid.`;
            showForm = false;
        }
        else if (props.currentBalance === undefined) {
            title = `${props.personName}'s balance is unknown.`;
            subtitle = `Please update their transactions below.`;
            showForm = false;
        }
        else if (props.type === 'iPaid') {
            title = `I currently owe ${props.personName} ${formatCurrency(-props.currentBalance, options)}`;
            subtitle = 'How much of this am I paying off?';
            maxSliderAmount = -props.currentBalance;
        }
        else if (props.type === 'theyPaid') {
            title = `${props.personName} currently owes me ${formatCurrency(props.currentBalance, options)}`;
            subtitle = 'How much of this are they paying off?';
            maxSliderAmount = props.currentBalance;
        }
    }
    else {
        title = props.type === 'iOwe' ? `I owe ${props.personName}` : `${props.personName} owes me`;
    }

    return (
        <div className="txn-edit">
            <h3>{title}</h3>
            {subtitle && <h4>{subtitle}</h4>}
            {showForm && <form>
                
                <label>
                    Description:
                    <input
                        type="text"
                        value={props.txn.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </label>
                <label className="full-amount-label">
                    <div className="full-amount-header">
                        Full amount:
                        {category(props.type) == 'iou' && (
                            <div className="full-amount-options">
                                <input
                                    type="checkbox"
                                    id="unknownAmount"
                                    checked={unknownAmount}
                                    onChange={(e) => handleUnknownAmountChange(e.target.checked)}
                                />
                                <label htmlFor="unknownAmount">Unknown</label>
                                <input
                                    type="checkbox"
                                    id="splitWithMe"
                                    checked={splitWithMe}
                                    onChange={(e) => handleSplitWithMeChange(e.target.checked)}
                                />
                                <label htmlFor="splitWithMe">Split</label>
                            </div>
                        )}
                    </div>
                    <input
                        type="number"
                        value={
                            unknownAmount
                                ? ''
                                : props.txn.fullAmount ?? ''
                        }
                        onChange={(e) => handleChange('fullAmount', e.target.value ? parseFloat(e.target.value) : null)}
                        disabled={unknownAmount && category(props.type) == 'iou'}
                    />
                    <div className="slider-container">
                        <span>{formatCurrency(0, options)}</span>
                        <input
                            type="range"
                            min={0}
                            max={maxSliderAmount}
                            step={options.stepAmount}
                            value={props.txn.fullAmount ?? 0}
                            onChange={(e) => handleChange('fullAmount', parseFloat(e.target.value))}
                            disabled={unknownAmount && category(props.type) == 'iou'}
                        />
                        <span>{formatCurrency(maxSliderAmount, options)}</span>
                    </div>
                </label>
                <label>
                    Notes:
                    <textarea
                        value={props.txn.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                    />
                </label>
                <p>{getTxnSummary({...props.txn, id: '0', type: props.type, personName: props.personName}, options)}</p>
                <div className="txn-edit-buttons">
                    <button type="button" onClick={handleSave} disabled={isSaveDisabled}>
                        Save
                    </button>
                    <button type="button" onClick={props.onCancel}>
                        Cancel
                    </button>
                </div>
            </form>}
        </div>
    );
};

export default TxnEdit;
