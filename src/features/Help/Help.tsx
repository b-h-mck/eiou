import "./Help.css";


const Help = () => {

    return (
        <section className="help">
            <h1>Help</h1>
            <h2 className="warning">Warning</h2>
            <p className="warning">This application is in early development. Future upgrades may cause to you lose data. Please do not use it for anything critical.</p>
            <h2>Overview</h2>
            <p>
                This app is a simple IOU tracker. It allows you to easily record when you owe money, when other people owe money to you, and when the debt is repaid,
                keeping track of the balance for each person along the way.
            </p>
            <p>
                It is intended to replace the practice of writing IOUs on paper or in a notepad app. 
                It is not intended to be a full-featured accounting app or an alternative currency.
            </p>
            <h2>How to use</h2>
            <p>
                All functionality is available from the home screen, and is hopefully fairly intuitive. 
                You can add people, add/edit transactions, and view the balance for each person.
            </p>
            <p>
                When adding a transaction, either a number needs to be entered, or the "Unknown amount" checkbox needs to be checked. 
                If the amount is unknown, the balance with the other person will also be unknown until the transaction is updated.
            </p>
            <p>
                You can edit transactions by clicking/tapping them in the Recent Transactions list. 
                You can't currently delete transactions (that will be added in a future version),
                but you can set their amount to 0.
            </p>
            <h2>Privacy</h2>
            <p>
                This app does not send or receive any data over the internet at all. All data is stored locally in your browser. 
                You can delete all your data at any time by going to the Settings page and clicking "Clear All Data".
            </p>
            <p>
                Future enhancements may include the ability to back up your data and share transactions with others, but this will only ever be done voluntarily, 
                and you will retain full control of all your data.
            </p>
            <h2>Future enhancements</h2>
            <p>
                Please see the <a href="https://github.com/b-h-mck/eiou">GitHub README</a> for a roadmap of future enhancements.
            </p>
            <h2>Feedback/contributions</h2>
            <p>
                If you have any feedback or suggestions for improvements, please feel free to open an issue on the <a href="https://github.com/b-h-mck/eiou">GitHub repo</a>. 
                If you would like to contribute, please fork the repo and submit a pull request.
            </p>
            <h2>License</h2>
            <p>
                This project is licensed under the <a href="https://github.com/b-h-mck/eiou/blob/main/LICENSE.txt">MIT License</a>.
            </p>
        </section>
    );
};

export default Help;