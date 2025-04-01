import { useState, useEffect } from 'react';
import './TxnTypeSelector.css';

interface TxnTypeSelectorProps {
    personName?: string;
    onChange: (selection: { type: 'iou' | 'pay'; direction: 'in' | 'out' } | null) => void;
    selected?: { type: 'iou' | 'pay'; direction: 'in' | 'out' } | null; // New prop for parent-controlled selection
}

const TxnTypeSelector = (props: TxnTypeSelectorProps) => {
    const { onChange, personName = 'Someone', selected: parentSelected } = props;
    const [selected, setSelected] = useState<{ type: 'iou' | 'pay'; direction: 'in' | 'out' } | null>(null);

    // Sync internal state with parent-controlled `selected` prop
    useEffect(() => {
        setSelected(parentSelected || null);
    }, [parentSelected]);

    const handleClick = (type: 'iou' | 'pay', direction: 'in' | 'out') => {
        if (selected && selected.type === type && selected.direction === direction) {
            // Unselect if the same button is clicked
            setSelected(null);
            onChange(null);
        } else {
            // Select the new button
            const newSelection = { type, direction };
            setSelected(newSelection);
            onChange(newSelection);
        }
    };

    return (
        <div className="newTxnButtons">
            <button
                className={`button top-left ${selected && selected.type === 'iou' && selected.direction === 'out' ? 'selected' : ''}`}
                onClick={() => handleClick('iou', 'out')}
            >
                <p>I owe</p>
                <p>{personName}</p>
            </button>
            <button
                className={`button top-right ${selected && selected.type === 'iou' && selected.direction === 'in' ? 'selected' : ''}`}
                onClick={() => handleClick('iou', 'in')}
            >
                <p>{personName}</p>
                <p>owes me</p>
            </button>
            <button
                className={`button bottom-left ${selected && selected.type === 'pay' && selected.direction === 'out' ? 'selected' : ''}`}
                onClick={() => handleClick('pay', 'out')}
            >
                <p>I paid</p>
                <p>{personName}</p>
            </button>
            <button
                className={`button bottom-right ${selected && selected.type === 'pay' && selected.direction === 'in' ? 'selected' : ''}`}
                onClick={() => handleClick('pay', 'in')}
            >
                <p>{personName}</p>
                <p>paid me</p>
            </button>
        </div>
    );
};

export default TxnTypeSelector;