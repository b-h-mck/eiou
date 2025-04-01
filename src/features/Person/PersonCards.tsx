import { useState, useEffect } from 'react';
import './PersonCards.css';
import { Person } from './PersonModel';

interface PersonCardsProps {
    people: Person[];
    onSave: (person: { name: string; balance: number }) => void;
    onCardClick: (personId: string | null) => void;
    selectedCard: string | null;
}

const PersonCards: React.FC<PersonCardsProps> = ({
    people,
    onSave,
    onCardClick,
    selectedCard: parentSelectedCard,
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    // Sync internal state with parent-controlled selectedCard
    useEffect(() => {
        setSelectedCard(parentSelectedCard);
    }, [parentSelectedCard]);

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleSave = () => {
        if (name !== '') {
            onSave({ name, balance: 0 });
            setIsAdding(false);
            setName('');
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
    };

    const handleCardClick = (person: Person) => {
        const newSelectedCard = selectedCard === person.id ? null : person.id;
        setSelectedCard(newSelectedCard ?? null);
        onCardClick(newSelectedCard ?? null); // Notify parent of the new selection
    };

    return (
        <ul className="card-list">
            <li className="add-card">
                {isAdding ? (
                    <div className="add-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={name}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSave} disabled={name === ''}>
                            Save
                        </button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={handleAddClick} className="add-button">
                        + Add New
                    </button>
                )}
            </li>
            {people.map((person) => (
                <PersonCard
                    person={person}
                    onClick={() => handleCardClick(person)}
                    isSelected={selectedCard === person.id}
                    key={person.id}
                />
            ))}
        </ul>
    );
};

export default PersonCards;



interface PersonCardProps {
    person: Person;
    onClick: () => void;
    isSelected: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onClick, isSelected }) => {
    return (
        <li className={`card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <h4>{person.name}</h4>
            {isSelected && <button className="edit-button">Edit</button>}
            <p>
                {person.balance >= 0
                    ? `${person.name} owes $${person.balance}`
                    : `You owe $${Math.abs(person.balance)}`}
            </p>
            {isSelected && <button className="repay-button">Repay</button>}
        </li>
    );
};