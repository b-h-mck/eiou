import { useState, useEffect, useMemo } from "react";
import { TxnEditableFields, Txn, TxnCalculationsByPersonId, calculateTxns, TxnType } from "../Txn/TxnModel";
import { calculatePeople, Person, PersonCalculations, PersonEditableFields } from "../Person/PersonModel";
import {
    getAllPeople,
    addPersonToDB,
    getAllTxns,
    addTxnToDB,
    putTxnInDB,
} from "../../shared/store";
import HomeUi from "./HomeUi";

const Home = () => {
    const [txnType, setTxnType] = useState<TxnType | null>(null);
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [people, setPeople] = useState<PersonCalculations[]>([]);
    const [txnsByPersonId, setTxnsByPersonId] = useState<TxnCalculationsByPersonId>({});

    const emptyTxnEditFields : TxnEditableFields = {
        description: "",
        notes: "",
        date: new Date().toISOString(),
        fullAmount: null,
        splitWithMe: false,
    };
    const [txnEditFields, setTxnEditFields] = useState<TxnEditableFields>(emptyTxnEditFields);
    
    // Load and calculate all data from the IndexedDB. This is called on page load, and also whenever the data is updated to refresh the local state
    // (not particularly efficient to fully reload every time, but we can fix it if and when we have performance issues)
    const loadData = async () => {
        const storedPeople = await getAllPeople();
        const storedTxns = await getAllTxns();
        const calculatedTxns = calculateTxns(storedTxns);
        const calculatedPeople = calculatePeople(storedPeople, calculatedTxns);
        setPeople(calculatedPeople);
        setTxnsByPersonId(calculatedTxns);
    };

    const txnsById = useMemo(() => {
        const allTxns = Object.values(txnsByPersonId).flatMap((txns) => txns);
        return Object.fromEntries(allTxns.map((txn) => [txn.id, txn]));
    }
    , [txnsByPersonId]);

    // Load the data on page load
    useEffect(() => {
        loadData();
    }, []);

    // Add a person to IndexedDB and reload data
    const addPerson = async (personEditableFields: PersonEditableFields) => {
        const person : Person = {
            ...personEditableFields,
            id: crypto.randomUUID(),
        };
        await addPersonToDB(person);
        await loadData();
        setSelectedPersonId(person.id || null);
    };

    // Add a transaction to IndexedDB and reload data
    const addTxn = async (newTxn: TxnEditableFields) => {
        if (!txnType) {
            throw new Error("Transaction type is not selected");
        }
        const txn : Txn = {
            ...newTxn,
            id: crypto.randomUUID(),
            personId: selectedPersonId || "Someone",
            type: txnType

        };
        if (txn.id) {
            await addTxnToDB(txn);
            await loadData();
            setTxnEditFields(emptyTxnEditFields);
        }
    };

    // Update a transaction in IndexedDB and reload data
    const updateTxn = async (id: string, updatedTxn: TxnEditableFields) => {
        const txn : Txn = {
            ...txnsById[id],
            ...updatedTxn
        };
        if (txn.id) {
            await putTxnInDB(txn);
            await loadData();
            setTxnEditFields(emptyTxnEditFields);
        }
    }

    const repayBalance = (personId: string) => {
        const person = people.find((p) => p.id === personId);
        const balance = person?.closingBalance || 0;
        if (balance == 0) return;

        const txnType = balance > 0 ? "theyPaid" : "iPaid";
        setTxnType(txnType);
        const newTxn : TxnEditableFields = {
            description: "",
            notes: "",
            date: new Date().toISOString(),
            fullAmount: Math.abs(balance),
            splitWithMe: false,
        };
        setTxnEditFields(newTxn);
    }




    return <HomeUi
        people={people}
        txnsByPersonId={txnsByPersonId}
        txnEditFields={txnEditFields}
        selectedTxnType={txnType}
        selectedPersonId={selectedPersonId}
        onSelectTxnType={setTxnType}
        onSelectPerson={setSelectedPersonId}
        onRepayBalance={repayBalance}
        onAddPerson={addPerson}
        onAddTxn={addTxn}
        onUpdateTxn={updateTxn}
    />;



    
};

export default Home;