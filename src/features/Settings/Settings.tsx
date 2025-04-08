import "./Settings.css";
import { addPeopleToDB, addTxnsToDB, clearAllPeople, clearAllTxns, getAllPeople, getAllTxns } from "../../shared/store";
import { useState } from "react";

const Settings = () => {
    const [message, setMessage] = useState("");
    const [confirmImportDisabled, setConfirmImportDisabled] = useState(true);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 5000); // Clear the message after 5 seconds
    };

    const exportData = async () => {
        const people = await getAllPeople();
        const txns = await getAllTxns();

        const allData = {
            people,
            txns
        };

        const allDataString = JSON.stringify(allData, null, 2);

        const blob = new Blob([allDataString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "eiou-data.json";
        a.click();

        URL.revokeObjectURL(url);
        showMessage("Data exported as eiou-data.json");
    };

    const importData = async () => {
        const dialog = document.getElementById("import-data-dialog") as HTMLDialogElement;
        dialog.showModal();
    };

    const confirmImport = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const dialog = document.getElementById("import-data-dialog") as HTMLDialogElement;
        const fileInput = dialog.querySelector("input[type='file']") as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = JSON.parse(e.target?.result as string);
                await clearAllPeople();
                await clearAllTxns();
                await addPeopleToDB(data.people);
                await addTxnsToDB(data.txns);
                showMessage("Data imported successfully!");
            };
            reader.readAsText(file);
        }
        dialog.close();
    };

    const clearData = async () => {
        const confirmed = window.confirm("Are you sure you want to clear all data? This action cannot be undone.");
        if (confirmed) {
            await clearAllPeople();
            await clearAllTxns();
            showMessage("All data cleared!");
        }
    };

    return (
        <>
        <section className="settings">
            <h1>Settings</h1>
            <button onClick={exportData} className="safe-button">
                Export Data
            </button>
            <button onClick={importData} className="dangerous-button">
                Import Data
            </button>
            <button onClick={clearData} className="dangerous-button">
                Clear All Data
            </button>
            <p className="message">{message ?? "&nbsp;"}</p>
        </section>
        <dialog id="import-data-dialog">
            <div>
                <h2>Import Data</h2>
                <p className="warning">Warning: Importing data will overwrite all existing data!</p>
                <input
                    className="file-input"
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        setConfirmImportDisabled(!file);
                    }}
                />
                <form method="dialog">
                    <button className="dangerous-button" onClick={confirmImport} disabled={confirmImportDisabled}>Import<br/>(WILL OVERWRITE)</button>
                    <button className="cancel-button">Cancel</button>
                </form>
            </div>
        </dialog>
        </>
    );
};

export default Settings;

