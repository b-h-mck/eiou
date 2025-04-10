import { useMemo, useRef } from "react";
import PersonCards from "../Person/PersonCards";
import { PersonCalculations, PersonEditableFields } from "../Person/PersonModel";
import TxnEdit from "../Txn/TxnEdit";
import TxnList from "../Txn/TxnList";
import { Txn, TxnCalculationsByPersonId, TxnEditableFields, TxnType } from "../Txn/TxnModel";

export interface HomeUiProps {
    people: PersonCalculations[];
    txnsByPersonId: TxnCalculationsByPersonId;

    newTxn: TxnEditableFields;
    onNewTxnChange: (txn: TxnEditableFields) => void;

    editingTxn: TxnEditableFields;
    onEditingTxnChange: (txn: TxnEditableFields) => void;

    selectedMode: Mode | null;
    onSelectMode: (mode: Mode | null) => void;

    selectedPersonId: string | null;
    onSelectPerson: (personId: string | null) => void;

    selectedTxnId: string | null;
    onSelectTxn: (txnId: string | null) => void;

    txnType: TxnType | null;

    onAddPersonSave: (person: PersonEditableFields) => void;
    onAddTxnSave: (txn: TxnEditableFields) => void;
    onUpdateTxnSave: (id: string, txn: TxnEditableFields) => void;
}

import './Home.css';
import ModeSelector, { Mode } from "./ModeSelector";


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

    const showPeople = props.selectedMode || props.selectedPersonId;
    const showTxnDetails = props.txnType && selectedPerson !== null;

    const personSelectorRef = useRef<HTMLDivElement>(null);
    const newTxnDetailsRef = useRef<HTMLDivElement>(null);

    return (
        <div className={`home ${showTxnDetails ? '' : 'no-newTxnDetails'}`}>
            <section className="startHere">
                <h2>Start here</h2>
                <ModeSelector
                    personName={selectedPerson?.name}
                    onChange={props.onSelectMode}
                    selected={props.selectedMode} />
            </section>
            <section className={`people ${showPeople ? '' : 'hidden'}`} onClick={handlePeoplePanelClick} ref={personSelectorRef}>
                {props.selectedMode === 'iOwe' && (<h2>Who do I owe?</h2>)}
                {props.selectedMode === 'theyOwe' && (<h2>Who owes me?</h2>)}
                {props.selectedMode === 'multiOwe' && (<h3>Select everyone involved (besides yourself)</h3>)}
                {props.selectedMode === 'repay' && (<h3>Who's repaying or getting repaid?</h3>)}
                {(props.selectedMode === 'viewBalances' || !props.selectedMode) && (<h3>Select a person to filter the transaction list</h3>)}
                <PersonCards
                    onAddSave={props.onAddPersonSave}
                    onCardSelect={props.onSelectPerson}
                    people={props.people}
                    selected={props.selectedPersonId}
                />
            </section>
            {showTxnDetails && (
                <section className="newTxnDetails" ref={newTxnDetailsRef}>
                    <TxnEdit
                        type={props.txnType!}
                        personName={selectedPerson?.name}
                        txn={props.newTxn}
                        currentBalance={selectedPerson?.closingBalance ?? undefined}
                        isEditingExistingTxn={false}
                        onChange={props.onNewTxnChange}
                        onSave={(txn: TxnEditableFields) => {
                            const txnToAdd: Txn = {
                                ...txn,
                                id: crypto.randomUUID(),
                                personId: selectedPerson?.id,
                                personName: selectedPerson?.name,
                                type: props.txnType!
                            };
                            props.onAddTxnSave(txnToAdd);
                            props.onSelectMode(null);
                        }}
                        onCancel={() => {
                            console.log("Transaction canceled");
                            props.onSelectMode(null);
                        }}
                    />
                </section>
            )}
            <section className="txnList">
                {selectedPerson && (<h2>Transactions with {selectedPerson.name}</h2>)}
                {!selectedPerson && (<h2>All Transactions</h2>)}
                <TxnList txns={recentTransactions}
                    selectedTxnId={props.selectedTxnId}
                    onSelectTxn={props.onSelectTxn}
                    editingTxn={props.editingTxn}
                    onEditingTxnChange={props.onEditingTxnChange}
                    onTxnSave={props.onUpdateTxnSave}
                     />
            </section>
        </div>
    );
}

export default HomeUi;
