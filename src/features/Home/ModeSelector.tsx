import { useEffect, useState } from "react";

import './ModeSelector.css';

export interface ModeSelectorProps {
    personName?: string;
    onChange: (selection: Mode | null) => void;
    selected?: Mode | null;
}

export type Mode = 'iOwe' | 'theyOwe' | 'multiOwe' | 'repay' | 'viewBalances';

const ModeSelector = ({personName, onChange, selected: parentSelected}: ModeSelectorProps) => {
    const [selected, setSelected] = useState<Mode| null>(null);

    // Sync internal state with parent-controlled selected prop
    useEffect(() => {
        setSelected(parentSelected || null);
    }, [parentSelected]);

    const handleClick = (type: Mode) => {
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

    const iOweString = personName ? `I owe ${personName}` : 'I owe someone';
    const theyOweString = personName ? `${personName} owes me` : 'Someone owes me';
    const multiOweString = '3+ people are involved';
    const repayString = 'A debt is getting paid off';
    const viewBalancesString = 'I just want to see balances';

    return (
        <div className="modeSelector">
            <button
                className={`button top-left ${selected === 'iOwe' ? 'selected' : ''}`}
                onClick={() => handleClick('iOwe')}
            >
                <p>{iOweString}</p>
            </button>
            <button
                className={`button top-right ${selected === 'theyOwe' ? 'selected' : ''}`}
                onClick={() => handleClick('theyOwe')}
            >
                <p>{theyOweString}</p>
            </button>
            <button
                className={`button bottom-left ${selected === 'multiOwe' ? 'selected' : ''}`}
                onClick={() => handleClick('multiOwe')} disabled
            >
                <p>{multiOweString}</p>
            </button>
            <button
                className={`button bottom-right ${selected === 'repay' ? 'selected' : ''}`}
                onClick={() => handleClick('repay')}
            >
                <p>{repayString}</p>
            </button>
            <button
                className={`button bottom-right ${selected === 'viewBalances' ? 'selected' : ''}`}
                onClick={() => handleClick('viewBalances')}
            >
                <p>{viewBalancesString}</p>
            </button>
        </div>
    );
}
export default ModeSelector;