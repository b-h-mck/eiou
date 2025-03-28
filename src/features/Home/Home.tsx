import NewTransactionButtons from "../../shared/NewTxnButtons"

const Home = () => {
    return (
        <div>
            <section className="newTxn">
                <h2>New Transaction</h2>
                <NewTransactionButtons onClick={(type, direction) => {console.log(type, direction)}} />
            </section>
            <section className="people">
                <h2>People</h2>
                <p>List of people will go here.</p>
            </section>
            <section className="recentTxns">
                <h2>Recent Transactions</h2>
                <p>List of transactions will go here.</p>
            </section>
        </div>
    )
}
export default Home