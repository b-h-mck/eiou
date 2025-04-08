import "./Settings.css";
import { clearAllPeople, clearAllTxns, getAllPeople, getAllTxns } from "../../shared/store";


const Settings = () => {

    const exportData = async () => {
        const people = await getAllPeople();
        const txns = await getAllTxns();

        const allData = {
            people,
            txns
        }

        const allDataString = JSON.stringify(allData, null, 2);

        const blob = new Blob([allDataString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "eiou-data.json";
        a.click();

        URL.revokeObjectURL(url);
    }

    const importData = async () => {
        // Implement the import logic here
        console.log("Importing data...");
    }

    const clearData = async () => {
        await clearAllPeople();
        await clearAllTxns();
        console.log("All data cleared!");
    };

    return (
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
        </section>
    );
};

export default Settings;