import "./Settings.css";
import { clearAllPeople, clearAllTxns } from "../../shared/store";


const Settings = () => {

    const clearData = async () => {
        await clearAllPeople();
        await clearAllTxns();
        console.log("All data cleared!");
    };

    return (
        <div className="settings">
            <h2>Settings</h2>
            <button onClick={clearData} className="clear-button">
                Clear All Data
            </button>
        </div>
    );
};

export default Settings;