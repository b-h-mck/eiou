import "./Settings.css";
import { clearAllPeople, clearAllTxns } from "../../shared/store";


const Settings = () => {

    const exportData = async () => {
        // Implement the export logic here
        console.log("Exporting data...");
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