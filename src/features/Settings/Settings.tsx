import { deleteDB, exportDB, importDB, parseExportedData } from "../../shared/store";
import "./Settings.css";
import { useState, useEffect } from "react";
import { Options } from "./OptionsModel";
import { OptionsDB } from "../../shared/store";

const Settings = () => {
    const [message, setMessage] = useState("");
    const [confirmImportDisabled, setConfirmImportDisabled] = useState(true);
    const [options, setOptions] = useState<Options>({
        prefix: "",
        suffix: "",
        decimalPlaces: 2,
        omitDecimalForWhole: false,
        defaultAmount: 20,
        stepAmount: 1,
        maxAmount: 100,
    });

    useEffect(() => {
        const fetchOptions = async () => {
            const storedOptions = await OptionsDB.get();
            if (storedOptions) {
                setOptions(storedOptions);
            }
        };
        fetchOptions();
    }, []);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 5000); // Clear the message after 5 seconds
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
            };
            reader.readAsText(file);
        }
        dialog.close();
    };

    const clearData = async () => {
        const confirmed = window.confirm("Are you sure you want to clear all data? This action cannot be undone.");
        if (confirmed) {
            await deleteDB()
        }
    };

    const handleOptionsChange = (field: keyof Options, value: string | number | boolean) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            [field]: value,
        }));
    };

    const handleOptionsSave = async () => {
        await OptionsDB.put(options);
        showMessage("Options saved successfully.");
    };

    return (
        <>
        <section className="settings">
            <h1>Settings</h1>
            <button onClick={handleExport} className="safe-button">
                Export Data
            </button>
            <button onClick={handleImport} className="dangerous-button">
                Import Data
            </button>
            <button onClick={clearData} className="dangerous-button">
                Clear All Data
            </button>
            <div className="currency-options">
                <h2>Currency Options</h2>
                <label>
                    Prefix:
                    <input
                        type="text"
                        value={options.prefix}
                        onChange={(e) => handleOptionsChange("prefix", e.target.value)}
                        maxLength={10}
                        pattern="^[^<>]*$"
                    />
                </label>
                <label>
                    Suffix:
                    <input
                        type="text"
                        value={options.suffix}
                        onChange={(e) => handleOptionsChange("suffix", e.target.value)}
                        maxLength={10}
                        pattern="^[^<>]*$"
                    />
                </label>
                <label>
                    Decimal Places:
                    <input
                        type="number"
                        value={options.decimalPlaces}
                        onChange={(e) => handleOptionsChange("decimalPlaces", parseInt(e.target.value))}
                    />
                </label>
                <label>
                    Omit Decimal for Whole Numbers:
                    <input
                        type="checkbox"
                        checked={options.omitDecimalForWhole}
                        onChange={(e) => handleOptionsChange("omitDecimalForWhole", e.target.checked)}
                    />
                </label>
                <label>
                    Default Amount:
                    <input
                        type="number"
                        value={options.defaultAmount}
                        onChange={(e) => handleOptionsChange("defaultAmount", parseFloat(e.target.value))}
                    />
                </label>
                <label>
                    Step Amount:
                    <input
                        type="number"
                        value={options.stepAmount}
                        onChange={(e) => handleOptionsChange("stepAmount", parseFloat(e.target.value))}
                    />
                </label>
                <label>
                    Max Amount:
                    <input
                        type="number"
                        value={options.maxAmount}
                        onChange={(e) => handleOptionsChange("maxAmount", parseFloat(e.target.value))}
                    />
                </label>
                <button onClick={handleOptionsSave} className="safe-button">
                    Save Options
                </button>
            </div>
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
