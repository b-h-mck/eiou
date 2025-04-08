import { openDB } from "idb";
import { Person } from "../features/Person/PersonModel";
import { Txn } from "../features/Txn/TxnModel";

const DB_NAME = "eiouDB";
const PEOPLE_STORE = "persons";
const TXNS_STORE = "txns";

export const initDB = async () => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(PEOPLE_STORE)) {
                db.createObjectStore(PEOPLE_STORE, { autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(TXNS_STORE)) {
                db.createObjectStore(TXNS_STORE, { autoIncrement: true });
            }
        },
    });
    return db;
};

export const getAllPeople = async () => {
    const db = await initDB();
    return await (db.getAll(PEOPLE_STORE) as Promise<Person[]>);
};

export const addPersonToDB = async (person: Person) => {
    const db = await initDB();
    await db.add(PEOPLE_STORE, person)
};

export const addPeopleToDB = async (people: Person[]) => {
    const db = await initDB();
    for (const person of people) {
        await db.add(PEOPLE_STORE, person);
    }
}

export const clearAllPeople = async () => {
    const db = await initDB();
    await db.clear(PEOPLE_STORE);
};

export const getAllTxns = async () => {
    const db = await initDB();
    return await (db.getAll(TXNS_STORE) as Promise<Txn[]>);
};

export const addTxnToDB = async (txn: Txn) => {
    const db = await initDB();
    await db.add(TXNS_STORE, txn, txn.id);
};

export const addTxnsToDB = async (txns: Txn[]) => {
    const db = await initDB();
    for (const txn of txns) {
        await db.add(TXNS_STORE, txn, txn.id);
    }
}

export const putTxnInDB = async (txn: Txn) => {
    const db = await initDB();
    await db.put(TXNS_STORE, txn, txn.id);
}

export const clearAllTxns = async () => {
    const db = await initDB();
    await db.clear(TXNS_STORE);
};