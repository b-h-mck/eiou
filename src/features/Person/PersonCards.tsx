import { useState, useEffect } from 'react';
import './PersonCards.css';
import { getBalanceString, Person, PersonCalculations, PersonEditableFields } from './PersonModel';
import { useOptions } from '../Settings/OptionsModel';

interface PersonCardsProps {
    people: PersonCalculations[];
    onAddSave?: (person: PersonEditableFields) => void;
    onEditSave?: (person: PersonEditableFields) => void;
    onCardSelect: (personId: string | null) => void;
    selected: string | null;
}

const PersonCards: React.FC<PersonCardsProps> = ({
    people,
    onAddSave,
    onCardSelect,
    selected: parentSelectedCard,
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

    const handleAddSave = () => {
        if (name !== '' && onAddSave) {
            onAddSave({ name, openingBalance: 0 });
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
        onCardSelect(newSelectedCard ?? null);
    };


    return (
        <ul className="card-list" onClick={() => setSelectedCard(null)}>
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
                        <button onClick={handleAddSave} disabled={name === ''}>
                            Save
                        </button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={ handleAddClick} className="add-button">
                        + Add New
                    </button>
                )}
            </li>
            {people.map((person) => (
                <PersonCard
                    person={person}
                    onCardClick={() => handleCardClick(person)}
                    isSelected={selectedCard === person.id}
                    key={person.id}
                />
            ))}
        </ul>
    );
};

export default PersonCards;



interface PersonCardProps {
    person: PersonCalculations;
    onCardClick: () => void;
    isSelected: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onCardClick, isSelected }) => {

    const onListItemClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent event bubbling to parent li
        onCardClick();
    }
    const options = useOptions();
    return (
        <li className={`card ${isSelected ? 'selected' : ''}`} onClick={onListItemClick}>
            <h4>{person.name}</h4>
            <p>
                {getBalanceString(person.name, person.closingBalance, options)}
            </p>
        </li>
    );
};