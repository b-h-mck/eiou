import { useState, useEffect, useMemo } from "react";
import { TxnEditableFields, Txn, TxnCalculationsByPersonId, calculateTxns, TxnType } from "../Txn/TxnModel";
import { calculatePeople, Person, PersonCalculations, PersonEditableFields } from "../Person/PersonModel";
import { PeopleDB, TxnsDB } from "../../shared/store";
import HomeUi from "./HomeUi";
import { Mode } from "./ModeSelector";

const Home = () => {

    // The mode selected in the Start Here panel
    const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

    // The person selected in the People panel
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

    // The transaction selected in the Transaction List panel
    const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);

    const emptyTxn : TxnEditableFields = {
        description: "",
        notes: "",
        date: new Date().toISOString(),
        fullAmount: 10,
        splitWithMe: false,
    };
    // The current state of the New Transaction input panel
    const [newTxn, setNewTxn] = useState<TxnEditableFields>(emptyTxn);

    // The current state of the transaction selected for editing in the Transaction List panel
    const [editingTxn, setEditingTxn] = useState<TxnEditableFields>(emptyTxn);

    // All the people available in the people panel
    const [people, setPeople] = useState<PersonCalculations[]>([]);

    // All the transactions available in the transaction panel, grouped by person ID
    const [txnsByPersonId, setTxnsByPersonId] = useState<TxnCalculationsByPersonId>({});

    
    // Calculate the selected person and transaction type.
    const selectedPerson = useMemo(() => {
        return people.find((person) => person.id === selectedPersonId) || null;
    }
    , [people, selectedPersonId]);

    const txnType = useMemo<TxnType | null>(() => {
        if (selectedMode === 'iOwe')
            return 'iOwe';
        if (selectedMode === 'theyOwe')
            return 'theyOwe';

        if (selectedMode === 'repay')
        {
            if (selectedPerson && (selectedPerson.closingBalance ?? 0) > 0) {
                return 'theyPaid';
            } else {
                return 'iPaid';
            }
        }
        return null;
    }, [selectedMode, selectedPerson]);

    
    const txnsById = useMemo(() => {
        const allTxns = Object.values(txnsByPersonId).flatMap((txns) => txns);
        return Object.fromEntries(allTxns.map((txn) => [txn.id, txn]));
    }
    , [txnsByPersonId]);
    
    // Load and calculate all data from the IndexedDB. This is called on page load, and also whenever the data is updated to refresh the local state
    // (not particularly efficient to fully reload every time, but we can fix it if and when we have performance issues)
    const loadData = async () => {
        const storedPeople = await PeopleDB.getAll();
        const storedTxns = await TxnsDB.getAll();
        const calculatedTxns = calculateTxns(storedTxns);
        const calculatedPeople = calculatePeople(storedPeople, calculatedTxns);
        setPeople(calculatedPeople);
        setTxnsByPersonId(calculatedTxns);
    };


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
        await PeopleDB.put(person);
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
            await TxnsDB.put(txn);
            await loadData();
            setNewTxn(emptyTxn);
        }
    };

    // Update a transaction in IndexedDB and reload data
    const updateTxn = async (id: string, updatedTxn: TxnEditableFields) => {
        const txn : Txn = {
            ...txnsById[id],
            ...updatedTxn
        };
        if (txn.id) {
            await TxnsDB.put(txn);
            await loadData();
            setNewTxn(emptyTxn);
        }
    }


    const setDefaultNewTxn = (mode: Mode | null, personId: string | null) => {
        const selectedPerson = people.find((person) => person.id === personId) || null;
        if (mode === 'repay' && selectedPerson?.closingBalance) {
            setNewTxn({
                ...emptyTxn,
                fullAmount: Math.abs(selectedPerson.closingBalance),
            });
        } else {
            setNewTxn(emptyTxn);
        }
    };

    const selectMode = async (mode: Mode | null) => {
        setSelectedMode(mode);
        setDefaultNewTxn(mode, selectedPersonId);
    }

    const selectPerson = async (id: string | null) => {
        setSelectedPersonId(id);
        setDefaultNewTxn(selectedMode, id);
    }

    const selectTxn = async (id: string | null) => {
        setSelectedTxnId(id);
        if (id) {
            const txn = txnsById[id];
            if (txn) {
                setEditingTxn(txn);
            }
        } else {
            setEditingTxn(emptyTxn);
        }
    };






    return <HomeUi
        people={people}
        txnsByPersonId={txnsByPersonId}
    
        newTxn={newTxn}
        onNewTxnChange={setNewTxn}

        editingTxn={editingTxn}
        onEditingTxnChange={setEditingTxn}

        selectedMode={selectedMode}
        onSelectMode={selectMode}

        selectedPersonId={selectedPersonId}
        onSelectPerson={selectPerson}

        selectedTxnId={selectedTxnId}
        onSelectTxn={selectTxn}

        txnType={txnType}

        onAddPersonSave={addPerson}
        onAddTxnSave={addTxn}
        onUpdateTxnSave={updateTxn}
    />;



    
};

export default Home;