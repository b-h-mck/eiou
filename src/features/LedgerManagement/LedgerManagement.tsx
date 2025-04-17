import React, { useState, useEffect } from 'react';
import { LedgersDB, OptionsDB } from '../../shared/store';
import { Ledger } from './LedgerModel';
import './LedgerManagement.css';

const LedgerManagement = () => {
    const [ledgers, setLedgers] = useState<Ledger[]>([]);
    const [activeLedgerId, setActiveLedgerId] = useState<string | null>(null);
    const [newLedgerName, setNewLedgerName] = useState<string>('');
    const [editingLedger, setEditingLedger] = useState<Ledger | null>(null);

    useEffect(() => {
        const fetchLedgers = async () => {
            const storedLedgers = await LedgersDB.getAll();
            setLedgers(storedLedgers);
        };

        const fetchActiveLedgerId = async () => {
            const options = await OptionsDB.get();
            if (options && options.activeLedgerId) {
                setActiveLedgerId(options.activeLedgerId);
            }
        };

        fetchLedgers();
        fetchActiveLedgerId();
    }, []);

    const handleAddLedger = async () => {
        if (newLedgerName.trim() === '') return;

        const newLedger: Ledger = {
            id: crypto.randomUUID(),
            name: newLedgerName,
            currencyOptions: {
                prefix: '$',
                suffix: '',
                decimalPlaces: 2,
                omitDecimalForWhole: true,
                defaultAmount: 20,
                stepAmount: 1,
                maxAmount: 100,
            },
        };

        await LedgersDB.put(newLedger);
        setLedgers([...ledgers, newLedger]);
        setNewLedgerName('');
    };

    const handleEditLedger = (ledger: Ledger) => {
        setEditingLedger(ledger);
    };

    const handleSaveEditLedger = async () => {
        if (editingLedger) {
            await LedgersDB.put(editingLedger);
            setLedgers(ledgers.map((ledger) => (ledger.id === editingLedger.id ? editingLedger : ledger)));
            setEditingLedger(null);
        }
    };

    const handleDeleteLedger = async (ledgerId: string) => {
        if (ledgerId === activeLedgerId) return;

        await LedgersDB.delete(ledgerId);
        setLedgers(ledgers.filter((ledger) => ledger.id !== ledgerId));
    };

    const handleSetActiveLedger = async (ledgerId: string) => {
        const options = await OptionsDB.get();
        if (options) {
            options.activeLedgerId = ledgerId;
            await OptionsDB.put(options);
            setActiveLedgerId(ledgerId);
        }
    };

    return (
        <div className="ledger-management">
            <h2>Ledger Management</h2>
            <ul>
                {ledgers.map((ledger) => (
                    <li key={ledger.id}>
                        <span>{ledger.name}</span>
                        <button onClick={() => handleEditLedger(ledger)}>Edit</button>
                        <button onClick={() => handleDeleteLedger(ledger)} disabled={ledger.id === activeLedgerId}>
                            Delete
                        </button>
                        <button onClick={() => handleSetActiveLedger(ledger.id)} disabled={ledger.id === activeLedgerId}>
                            {ledger.id === activeLedgerId ? 'Active' : 'Set Active'}
                        </button>
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={newLedgerName}
                    onChange={(e) => setNewLedgerName(e.target.value)}
                    placeholder="New Ledger Name"
                />
                <button onClick={handleAddLedger}>Add Ledger</button>
            </div>
            {editingLedger && (
                <div>
                    <h3>Edit Ledger</h3>
                    <input
                        type="text"
                        value={editingLedger.name}
                        onChange={(e) => setEditingLedger({ ...editingLedger, name: e.target.value })}
                    />
                    <button onClick={handleSaveEditLedger}>Save</button>
                    <button onClick={() => setEditingLedger(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default LedgerManagement;
