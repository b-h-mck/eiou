import { openDB, unwrap } from "idb";
import { Person } from "../features/Person/PersonModel";
import { Txn } from "../features/Txn/TxnModel";

const DB_NAME = "eiouDB";
const DB_VERSION = 2; // Increment this when you change the database schema, and add a migration below.

const PEOPLE_STORE = "people";
const TXNS_STORE = "txns";
const OPTIONS_STORE = "options";

// These accessors provide access to the database stores to other parts of the app.
export const PeopleDB = createIdObjectAccessor<Person>(PEOPLE_STORE);
export const TxnsDB = createIdObjectAccessor<Txn>(TXNS_STORE);
export const OptionsDB = createSingletonObjectAccessor<any>(OPTIONS_STORE);


const initDB = async (version : number = DB_VERSION) => {
    const db = await openDB(DB_NAME, version, {

        // The upgrade method here is used to both build the database from scratch and to migrate to a later version.
        upgrade(db, oldVersion, _, transaction) {
            console.log(`Upgrading database from version ${oldVersion} to ${version}`);

            // Data access here should be done through the nativeTransaction object, as the promise-based get() etc don't work in upgrades.
            // See v2 as an example
            const nativeTransaction = unwrap(transaction);

            const v = (conditionVersion: number) => oldVersion < conditionVersion && version >= conditionVersion;

            // DB migrations should be added here. 
            // - Migrations shouldn't refer to any of the app code (types, etc), as this will always be the latest version. Instead, use `any`.
            // - If renaming or deleting a store, hardcode the old store name in old migrations. The consts are just for the latest version.
            if (v(1)) {
                // create the persons and txns stores (persons will be renamed to people in v2)
                db.createObjectStore("persons", { keyPath: "id" });
                db.createObjectStore(TXNS_STORE, { keyPath: "id" });
            }
            if (v(2)) {
                // v2: add the options store and rename persons to people (create, copy, delete)
                db.createObjectStore(OPTIONS_STORE, { autoIncrement: true });
                db.createObjectStore(PEOPLE_STORE, { keyPath: "id" })

                const oldPersonsRequest = nativeTransaction.objectStore("persons").getAll();
                oldPersonsRequest.onsuccess = (event) => {
                    const oldPersons = (event.target as IDBRequest).result;
                    for (const person of oldPersons) {
                        nativeTransaction.objectStore(PEOPLE_STORE).add(person);
                    }
                };

                db.deleteObjectStore("persons");
            }
        },
    });
    return db;
};



export const deleteDB = async () : Promise<void> => {
    // Close any open connections to the database
    const db = await openDB(DB_NAME);
    db.close();

    // Use indexedDB.deleteDatabase to completely delete the database
    await new Promise<void>((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

        deleteRequest.onsuccess = () => {
            console.log(`Database '${DB_NAME}' deleted successfully.`);
            resolve();
        };

        deleteRequest.onerror = (_) => {
            console.error(`Error deleting database '${DB_NAME}':`, deleteRequest.error);
            reject(deleteRequest.error);
        };

        deleteRequest.onblocked = () => {
            console.warn(`Database deletion is blocked. Close all open connections.`);
        };
    });
}



export type ExportedData = {
    version: number,
    stores: Record<string, any[]>
}

export const exportDB = async () : Promise<ExportedData> => {
    const db = await initDB();
    const result : ExportedData = {
        version: db.version,
        stores: {}
    }
    const storeNames = db.objectStoreNames;
    for (const storeName of storeNames) {
        result.stores[storeName] = await db.getAll(storeName);
    }
    return result;
}

export const parseExportedData = (data: any) : ExportedData => {
    // v1 has no version field and should be treated as the stores object
    if (!data.version) {
        return {
            version: 1,
            stores: data
        } as ExportedData;
    }
    return data as ExportedData;
}

export const importDB = async (data: ExportedData) : Promise<void> => {

    // Delete the current database and start fresh.
    await deleteDB();

    // We want to import the data at the ExportedData version, not the current version.
    const db = await initDB(data.version);
    const storeNames = Object.keys(data.stores);
    for (const storeName of storeNames) {
        const items = data.stores[storeName];
        for (const item of items) {
            if (!db.objectStoreNames.contains(storeName)) {
                console.warn(`Store '${storeName}' does not exist in the database. Skipping import for this store.`);
                continue;
            }
            await db.add(storeName, item);
        }
    }

    // Close the connection, so that the next connection can upgrade the database if needed.
    db.close();
    console.log(`Database '${DB_NAME}' imported at version ${data.version}.`);
}


function createIdObjectAccessor<TObject>(storeName: string) {
    return {
        get: async (id: string) => {
            const db = await initDB();
            return await (db.get(storeName, id) as Promise<TObject>);
        },
        getAll: async () => {
            const db = await initDB();
            return await (db.getAll(storeName) as Promise<TObject[]>);
        },
        put: async (object: TObject) => {
            const db = await initDB();
            await db.put(storeName, object);
        },
        delete: async (id: string) => {
            const db = await initDB();
            await db.delete(storeName, id);
        },
    }
}


function createSingletonObjectAccessor<TObject>(storeName: string) {
    return {
        get: async () => {
            const db = await initDB();
            const result = await (db.getAll(storeName) as Promise<TObject[]>);
            return result.length > 0 ? result[0] : null;
        },
        put: async (object: TObject) => {
            const db = await initDB();
            await db.clear(storeName);
            await db.put(storeName, object);
        }
    }
}
