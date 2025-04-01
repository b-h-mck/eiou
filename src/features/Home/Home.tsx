import { useState, useEffect } from "react";
import PersonCards from "../Person/PersonCards";
import NewTransactionButtons from "../Txn/TxnTypeSelector";
import TxnEdit from "../Txn/TxnEdit";
import { TxnEditableFields, Txn } from "../Txn/TxnModel";
import {
    getAllPeople,
    addPersonToDB,
    getAllTxns,
    addTxnToDB,
} from "../../shared/store";

import './Home.css';

const Home = () => {
    const [txnType, setTxnType] = useState<null | { type: 'iou' | 'pay', direction: 'in' | 'out' }>(null);
    const [person, setPerson] = useState<null | { id: string, name: string }>(null);
    const [people, setPeople] = useState<{ id: string; name: string; balance: number }[]>([]);
    const [txns, setTxns] = useState<Txn[]>([]);

    // Load initial data from IndexedDB
    useEffect(() => {
        const loadData = async () => {
            const storedPeople = await getAllPeople();
            const storedTxns = await getAllTxns();
            setPeople(storedPeople);
            setTxns(storedTxns);
        };

        loadData();
    }, []);

    // Add a person to IndexedDB and state
    const addPerson = async (newPerson: { id: string; name: string; balance: number }) => {
        await addPersonToDB(newPerson);
        setPeople((prev) => [...prev, newPerson]);
    };

    // Add a transaction to IndexedDB and state
    const addTxn = async (newTxn: Txn) => {
        if (newTxn.id) {
            await addTxnToDB(newTxn);
            setTxns((prev) => [...prev, newTxn]);
        }
    };

    // Handle click on the .people panel
    const handlePeoplePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) {
            return;
        }
        setPerson(null); // Clear the current selection
    };

    return (
        <div className={`home ${!txnType ? 'no-newTxnDetails' : ''}`}>
            <section className="newTxn">
                <h2>New Transaction</h2>
                <NewTransactionButtons
                    selected={txnType}
                    onChange={(p) => setTxnType(p)}
                    personName={person?.name}
                />
            </section>
            <section className="people" onClick={handlePeoplePanelClick}>
                <h2>People</h2>
                <PersonCards
                    onSave={(person) => {
                        const newPerson = { id: crypto.randomUUID(), name: person.name, balance: person.balance };
                        addPerson(newPerson);
                    }}
                    onCardClick={(p) => setPerson(people.find((person) => person.id === p) || null)}
                    people={people}
                    selectedCard={person?.id ?? null}
                />
            </section>
            {txnType && (
                <section className="newTxnDetails">
                    <TxnEdit
                        type={txnType.type}
                        direction={txnType.direction}
                        personName={person?.name}
                        txn={{
                            description: "",
                            notes: "",
                            date: new Date().toISOString().split('T')[0], // Set current date
                            fullAmount: null,
                            splitWithMe: false,
                        }}
                        onChange={(txn: TxnEditableFields) => {
                            console.log("Transaction updated:", txn);
                        }}
                        onSave={(txn: TxnEditableFields) => {
                            const txnToAdd: Txn = {
                                ...txn,
                                id: crypto.randomUUID(),
                                personId: person?.id,
                                personName: person?.name,
                                type: txnType.type,
                                direction: txnType.direction,
                            };
                            addTxn(txnToAdd);
                            setTxnType(null);
                        }}
                        onCancel={() => {
                            console.log("Transaction canceled");
                            setTxnType(null);
                        }}
                    />
                </section>
            )}
            <section className="recentTxns">
                <h2>Recent Transactions</h2>
                <ul>
                    {txns.map((txn) => (
                        <li key={txn.id}>{txn.description || "No description"}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Home;