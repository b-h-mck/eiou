import { getTxnSummary, TxnCalculations, TxnEditableFields } from "./TxnModel";
import "./TxnList.css";
import { getBalanceString } from "../Person/PersonModel";
import { Fragment, useState } from "react";
import TxnEdit from "./TxnEdit";
import { formatCurrency, useOptions } from "../Settings/OptionsModel";
import { TxnsDB } from "../../shared/store";

interface TxnListProps {
    txns: TxnCalculations[];

    selectedTxnId: string | null;
    onSelectTxn: (txnId: string | null) => void;

    editingTxn: TxnEditableFields | null;
    onEditingTxnChange: (txn: TxnEditableFields) => void;

    onTxnSave: (txnId: string, txn: TxnEditableFields) => void;
}

const TxnList: React.FC<TxnListProps> = (props) => {
    const options = useOptions();
    const [txns, setTxns] = useState<TxnCalculations[]>(props.txns);

    if (txns.length === 0) {
        return <div className="txn-list">No transactions found</div>;
    }
    var txnColumns = txns.map((txn) => ({
        txn: txn,
        columns: {
            "Date": new Date(txn.date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
            "Description": getTxnSummary(txn, options),
            "Balance Before": getBalanceString(txn.personName ?? "Someone", txn.balanceBefore, options),
            "Amount": formatCurrency(Math.abs(txn.finalAmount ?? 0), options),
            "Balance After": getBalanceString(txn.personName ?? "Someone", txn.balanceAfter, options),
        }
    }));

    const handleRowClick = (id: string) => {
        if (props.selectedTxnId === id) {
            props.onSelectTxn(null); // Deselect if already selected
        } else {
            props.onSelectTxn(id); // Select the clicked row
        }
    };

    const handleSave = (txn: TxnEditableFields) => {
        if (props.selectedTxnId) {
            props.onTxnSave(props.selectedTxnId, txn);
            props.onSelectTxn(null); // Deselect after saving
        }
    };

    const handleCancel = () => {
        props.onSelectTxn(null); // Deselect on cancel
    };

    const handleDelete = async () => {
        if (props.selectedTxnId) {
            await TxnsDB.delete(props.selectedTxnId);
            await loadData();
            props.onSelectTxn(null); // Deselect after deletion
        }
    };

    const loadData = async () => {
        const storedTxns = await TxnsDB.getAll();
        setTxns(storedTxns);
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
                            <tr  onClick={() => handleRowClick(row.txn.id)} className={props.selectedTxnId === row.txn.id ? "selected" : ""}>
                                {Object.values(row.columns).map((value, index) => (
                                    <td key={index}>{value}</td>
                                ))}
                            </tr>
                            {props.selectedTxnId === row.txn.id && props.editingTxn &&
                                <tr className="txn-edit-row">
                                    <td colSpan={Object.keys(row.columns).length}>
                                        <TxnEdit txn={props.editingTxn} personName={row.txn.personName} type={row.txn.type} 
                                        onChange={props.onEditingTxnChange} onSave={handleSave} onCancel={handleCancel} isEditingExistingTxn={true} 
                                        deleteVisible={true} onDelete={handleDelete} />
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
                        <div onClick={() => handleRowClick(row.txn.id)} className={props.selectedTxnId === row.txn.id ? "txn-card selected" : "txn-card"}>
                            {Object.entries(row.columns).map(([key, value]) => (
                                <p key={key}><strong>{key}:</strong> {value}</p>
                            ))}
                        </div>
                        {props.selectedTxnId === row.txn.id && props.editingTxn && (
                            <div className="txn-edit-card">
                                <TxnEdit txn={props.editingTxn} personName={row.txn.personName} type={row.txn.type} onChange={props.onEditingTxnChange} onSave={handleSave} onCancel={handleCancel} isEditingExistingTxn={true} 
                                deleteVisible={true} onDelete={handleDelete} />
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default TxnList;
