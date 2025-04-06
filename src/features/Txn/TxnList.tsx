import { getTxnSummary, TxnCalculations, TxnEditableFields } from "./TxnModel";
import "./TxnList.css";
import { getBalanceString } from "../Person/PersonModel";
import { Fragment, useState } from "react";
import TxnEdit from "./TxnEdit";

interface TxnListProps {
    txns: TxnCalculations[];
    onTxnClick: (txnId: string) => void;
    onTxnSave: (txnId: string, txn: TxnEditableFields) => void;
}

const TxnList: React.FC<TxnListProps> = ({ txns, onTxnClick, onTxnSave }) => {

    const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);

    if (txns.length === 0) {
        return <div className="txn-list">No transactions found</div>;
    }
    var txnColumns = txns.map((txn) => ({
        txn: txn,
        columns: {
            "Date": new Date(txn.date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
            "Description": getTxnSummary(txn),
            "Balance Before": getBalanceString(txn.personName ?? "Someone", txn.balanceBefore),
            "Balance After": getBalanceString(txn.personName ?? "Someone", txn.balanceAfter),
        }
    }));


    const handleRowClick = (id: string) => {
        if (selectedTxnId === id) {
            setSelectedTxnId(null); // Deselect if already selected
        } else {
            setSelectedTxnId(id); // Select the clicked row
        }
        onTxnClick(id);
    };

    const handleSave = (txn: TxnEditableFields) => {
        if (selectedTxnId) {
            onTxnSave(selectedTxnId, txn);
            setSelectedTxnId(null); // Deselect after saving
        }
    };

    const handleCancel = () => {
        setSelectedTxnId(null); // Deselect on cancel
    };

    return (
        <div className="txn-list">
            {/* Table layout for wide screens */}
            <table className="txn-table">
                <thead>
                    <tr>
                        {Object.keys(txnColumns[0].columns).map((key, index) => (
                            <th key={index}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {txnColumns.map((row) => (
                        <Fragment key={row.txn.id}>
                            <tr  onClick={() => handleRowClick(row.txn.id)} className={selectedTxnId === row.txn.id ? "selected" : ""}>
                                {Object.values(row.columns).map((value, index) => (
                                    <td key={index}>{value}</td>
                                ))}
                            </tr>
                            {selectedTxnId === row.txn.id &&
                                <tr className="txn-edit-row">
                                    <td colSpan={Object.keys(row.columns).length}>
                                        <TxnEdit txn={row.txn} personName={row.txn.personName} type={row.txn.type} onChange={() => {}} onSave={handleSave} onCancel={handleCancel} />
                                    </td>
                                </tr>
                            }
                        </Fragment>
                    ))}
                </tbody>
            </table>

            {/* Card layout for narrow screens */}
            <div className="txn-cards">
                {txnColumns.map((row) => (
                    <Fragment key={row.txn.id}>
                        <div className="txn-card" onClick={() => handleRowClick(row.txn.id)}>
                            {Object.entries(row.columns).map(([key, value]) => (
                                <p key={key}><strong>{key}:</strong> {value}</p>
                            ))}
                        </div>
                        {selectedTxnId === row.txn.id && (
                            <div className="txn-edit-card">
                                <TxnEdit txn={row.txn} personName={row.txn.personName} type={row.txn.type} onChange={() => {}} onSave={handleSave} onCancel={handleCancel} />
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default TxnList;