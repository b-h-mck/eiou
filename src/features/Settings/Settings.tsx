import "./Settings.css";
import { clearAllPeople, clearAllTxns } from "../../shared/store";


const Settings = () => {

    const clearData = async () => {
        await clearAllPeople();
        await clearAllTxns();
        console.log("All data cleared!");
    };

    return (
        <section className="settings">
            <h1>Settings</h1>
            <button onClick={clearData} className="clear-button">
                Clear All Data
            </button>
        </section>
    );
};

export default Settings;