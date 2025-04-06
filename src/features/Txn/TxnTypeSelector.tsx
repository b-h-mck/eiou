import { useState, useEffect } from 'react';
import './TxnTypeSelector.css';
import { TxnType } from './TxnModel';

interface TxnTypeSelectorProps {
    personName?: string;
    onChange: (selection: TxnType | null) => void;
    selected?: TxnType| null;
}

const TxnTypeSelector = (props: TxnTypeSelectorProps) => {
    const { onChange, personName = 'Someone', selected: parentSelected } = props;
    const [selected, setSelected] = useState<TxnType| null>(null);

    // Sync internal state with parent-controlled `selected` prop
    useEffect(() => {
        setSelected(parentSelected || null);
    }, [parentSelected]);

    const handleClick = (type: TxnType) => {
        if (selected && selected === type) {
            // Unselect if the same button is clicked
            setSelected(null);
            onChange(null);
        } else {
            // Select the new button
            setSelected(type);
            onChange(type);
        }
    };

    return (
        <div className="txnTypeSelector">
            <button
                className={`button top-left ${selected === 'iOwe' ? 'selected' : ''}`}
                onClick={() => handleClick('iOwe')}
            >
                <p>I owe</p>
                <p>{personName}</p>
            </button>
            <button
                className={`button top-right ${selected === 'theyOwe' ? 'selected' : ''}`}
                onClick={() => handleClick('theyOwe')}
            >
                <p>{personName}</p>
                <p>owes me</p>
            </button>
            <button
                className={`button bottom-left ${selected === 'iPaid' ? 'selected' : ''}`}
                onClick={() => handleClick('iPaid')}
            >
                <p>I paid</p>
                <p>{personName}</p>
            </button>
            <button
                className={`button bottom-right ${selected === 'theyPaid' ? 'selected' : ''}`}
                onClick={() => handleClick('theyPaid')}
            >
                <p>{personName}</p>
                <p>paid me</p>
            </button>
        </div>
    );
};

export default TxnTypeSelector;