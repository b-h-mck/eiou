import { useMemo } from "react";
import PersonCards from "../Person/PersonCards";
import { PersonCalculations, PersonEditableFields } from "../Person/PersonModel";
import TxnEdit from "../Txn/TxnEdit";
import TxnList from "../Txn/TxnList";
import { Txn, TxnCalculationsByPersonId, TxnEditableFields, TxnType } from "../Txn/TxnModel";
import TxnTypeSelector from "../Txn/TxnTypeSelector";

export interface HomeUiProps {
    people: PersonCalculations[];
    txnsByPersonId: TxnCalculationsByPersonId;
    txnEditFields : TxnEditableFields;

    selectedTxnType: TxnType | null;
    selectedPersonId: string | null;
    onSelectTxnType: (txnType: TxnType | null) => void;
    onSelectPerson: (personId: string | null) => void;
    onRepayBalance: (personId: string) => void;
    onAddPerson: (person: PersonEditableFields) => void;
    onAddTxn: (txn: TxnEditableFields) => void;
    onUpdateTxn: (id: string, txn: TxnEditableFields) => void;
}

import './Home.css';


const HomeUi = (props: HomeUiProps) => {

    // Find the selected person
    const selectedPerson = props.people.find((person) => person.id === props.selectedPersonId) || null;

    // If the user clicks on the people panel outside of a card, deselect the selected person
    const handlePeoplePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("li")) {
            return;
        }
        props.onSelectPerson(null);
    };

    // Compute the transactions to display in TxnList
    const recentTransactions = useMemo(() => {
        if (props.selectedPersonId) {
            return (props.txnsByPersonId[props.selectedPersonId] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else {
            // If no person is selected, flatten all transactions and sort by date
            return Object.values(props.txnsByPersonId)
                .flatMap((txnData) => txnData)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    }, [props.txnsByPersonId, props.selectedPersonId]);

    return (
        <div className={`home ${!props.selectedTxnType ? 'no-newTxnDetails' : ''}`}>
            <section className="newTxn">
                <h2>New Transaction</h2>
                <TxnTypeSelector
                    selected={props.selectedTxnType}
                    onChange={(p) => props.onSelectTxnType(p)}
                    personName={selectedPerson?.name}
                />
            </section>
            <section className="people" onClick={handlePeoplePanelClick}>
                <h2>People</h2>
                <PersonCards
                    onAddSave={props.onAddPerson}
                    onCardSelect={props.onSelectPerson}
                    onRepayBalance={props.onRepayBalance}
                    people={props.people}
                    selected={props.selectedPersonId}
                />
            </section>
            {props.selectedTxnType && (
                <section className="newTxnDetails">
                    <TxnEdit
                        type={props.selectedTxnType}
                        personName={selectedPerson?.name}
                        txn={props.txnEditFields}
                        onChange={(txn: TxnEditableFields) => {
                            console.log("Transaction updated:", txn);
                        }}
                        onSave={(txn: TxnEditableFields) => {
                            if (!props.selectedTxnType) return;
                            const txnToAdd: Txn = {
                                ...txn,
                                id: crypto.randomUUID(),
                                personId: selectedPerson?.id,
                                personName: selectedPerson?.name,
                                type: props.selectedTxnType,
                            };
                            props.onAddTxn(txnToAdd);
                            props.onSelectTxnType(null);
                        }}
                        onCancel={() => {
                            console.log("Transaction canceled");
                            props.onSelectTxnType(null);
                        }}
                    />
                </section>
            )}
            <section className="recentTxns">
                <h2>Recent Transactions</h2>
                <TxnList txns={recentTransactions} 
                    onTxnClick={() => {}}
                    onTxnSave={props.onUpdateTxn}
                     />
            </section>
        </div>
    );
}

export default HomeUi;