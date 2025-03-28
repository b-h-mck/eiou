const PersonCards = () => {

    return (
        <ul className="card-list">
            <li>
                <a href="/person/1">Alice</a>
                <p>Alice owes $50</p>
            </li>
            <li>
                <a href="/person/2">Bob</a>
                <p>You owe $21</p>
            </li>
            <li>
                <a href="/person/3">Charlie</a>
                <p>Charlie owes $43</p>
            </li>
            <li>
                <a href="/person/4">Dungleberry</a>
                <p>Dungleberry owes $4</p>
            </li>
        </ul>
    );
}
export default PersonCards;