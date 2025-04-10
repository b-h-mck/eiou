import { deleteDB, exportDB, importDB, parseExportedData } from "../../shared/store";
import "./Settings.css";
import { useEffect, useState } from "react";
import { defaultOptions, Options } from "./OptionsModel";
import { OptionsDB } from "../../shared/store";

const Settings = () => {
    const [message, setMessage] = useState("");
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [confirmImportDisabled, setConfirmImportDisabled] = useState(true);
    const [editingOptions, setEditingOptions] = useState<Options | null>(null);

    const fetchOptions = async () => {
        const options = await OptionsDB.get();
        setEditingOptions(options || defaultOptions);
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setIsMessageVisible(true); // Show the message immediately
        setTimeout(() => setIsMessageVisible(false), 5000); // Start fade-out after 8 seconds
        setTimeout(() => setMessage(""), 10000); // Fully remove the message after 10 seconds
    };

    const handleExport = async () => {
        const exportedData = await exportDB();
        const exportedDataString = JSON.stringify(exportedData);

        const blob = new Blob([exportedDataString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "eiou-data.json";
        a.click();

        URL.revokeObjectURL(url);
        showMessage("Data exported as eiou-data.json");
    };

    const handleImport = async () => {
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
                const exportedDataObject = JSON.parse(e.target?.result as string);
                const exportedData = parseExportedData(exportedDataObject);
                await importDB(exportedData);
                await fetchOptions(); // Refresh options after import
                showMessage("Data imported successfully.");
            };
            reader.readAsText(file);
        }
        dialog.close();
    };

    const handleDeleteDB = async () => {
        const confirmed = window.confirm("Are you sure you want to clear all data? This action cannot be undone.");
        if (confirmed) {
            await deleteDB();
            await fetchOptions(); // Refresh options after delete
            showMessage("Database cleared successfully.");
        }
    };

    const handleOptionsChange = (field: keyof Options, value: string | number | boolean) => {
        setEditingOptions((prevOptions) => ({
            ...prevOptions!,
            [field]: value,
        }));
    };

    const handleOptionsSave = async () => {
        if (editingOptions) {
            await OptionsDB.put(editingOptions);
            await fetchOptions(); // Refresh options after save
            showMessage("Options saved successfully.");
        }
    };

    if (!editingOptions) {
        return <div>Loading...</div>; // Show a loading state while options are being fetched
    }

    return (
        <>
            <section className="settings currency-options">
                <h2>Currency Options</h2>
                <label>
                    Prefix:
                    <input
                        type="text"
                        value={editingOptions.prefix}
                        onChange={(e) => handleOptionsChange("prefix", e.target.value)}
                        maxLength={10}
                        pattern="^[^<>]*$"
                    />
                </label>
                <label>
                    Suffix:
                    <input
                        type="text"
                        value={editingOptions.suffix}
                        onChange={(e) => handleOptionsChange("suffix", e.target.value)}
                        maxLength={10}
                        pattern="^[^<>]*$"
                    />
                </label>
                <label>
                    Decimal Places:
                    <input
                        type="number"
                        value={editingOptions.decimalPlaces}
                        onChange={(e) => handleOptionsChange("decimalPlaces", parseInt(e.target.value))}
                    />
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={editingOptions.omitDecimalForWhole}
                        onChange={(e) => handleOptionsChange("omitDecimalForWhole", e.target.checked)}
                    />
                    Omit Decimal for Whole Numbers
                </label>
                <label>
                    Default Amount:
                    <input
                        type="number"
                        value={editingOptions.defaultAmount}
                        onChange={(e) => handleOptionsChange("defaultAmount", parseFloat(e.target.value))}
                    />
                </label>
                <label>
                    Step Amount:
                    <input
                        type="number"
                        value={editingOptions.stepAmount}
                        onChange={(e) => handleOptionsChange("stepAmount", parseFloat(e.target.value))}
                    />
                </label>
                <label>
                    Max Amount:
                    <input
                        type="number"
                        value={editingOptions.maxAmount}
                        onChange={(e) => handleOptionsChange("maxAmount", parseFloat(e.target.value))}
                    />
                </label>
                <button className="save-options-button" onClick={handleOptionsSave}>Save Options</button>
                <p className={`message ${isMessageVisible ? "visible" : "fade-out"}`}>{message ?? "\u00A0"}</p>
            </section>
            <section className="settings db-management">
                <h2>Database Management</h2>
                <button onClick={handleExport}>Export Data</button>
                <button className="dangerous-button" onClick={handleImport}>Import Data (WILL OVERWRITE ALL RECORDS)</button>
                <button className="dangerous-button" onClick={handleDeleteDB}>Delete Database (WILL DELETE ALL RECORDS)</button>
                <p className={`message ${isMessageVisible ? "visible" : "fade-out"}`}>{message ?? "\u00A0"}</p>
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
                        <button className="dangerous-button" onClick={confirmImport} disabled={confirmImportDisabled}>Import<br />(WILL OVERWRITE)</button>
                        <button className="cancel-button">Cancel</button>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default Settings;
