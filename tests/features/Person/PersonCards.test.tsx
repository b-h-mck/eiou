import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PersonCards from '../../../src/features/Person/PersonCards';
import { PersonEditableFields } from '../../../src/features/Person/PersonModel';

// Mock external dependencies
jest.mock('../../../src/shared/store', () => ({
  PeopleDB: {
    getAll: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

describe('PersonCards Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render PersonCards component', () => {
    render(<PersonCards people={[]} onCardSelect={jest.fn()} selected={null} />);
    expect(screen.getByText('+ Add New')).toBeInTheDocument();
  });

  test('should allow user to add a new person', async () => {
    render(<PersonCards people={[]} onAddSave={jest.fn()} onCardSelect={jest.fn()} selected={null} />);
    const addNewButton = screen.getByText('+ Add New');
    fireEvent.click(addNewButton);
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument());
  });

  test('should allow user to select a person card', async () => {
    const people = [{ id: '1', name: 'John Doe', closingBalance: 0 }];
    render(<PersonCards people={people} onCardSelect={jest.fn()} selected={null} />);
    const personCard = screen.getByText('John Doe');
    fireEvent.click(personCard);
    await waitFor(() => expect(personCard).toHaveClass('selected'));
  });

  test('should allow user to edit a person card', async () => {
    const people = [{ id: '1', name: 'John Doe', closingBalance: 0 }];
    const onEditSave = jest.fn();
    render(<PersonCards people={people} onCardSelect={jest.fn()} selected={null} onEditSave={onEditSave} />);
    const personCard = screen.getByText('John Doe');
    fireEvent.click(personCard);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => expect(onEditSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jane Doe' })));
  });

  test('should allow user to delete a person card', async () => {
    const people = [{ id: '1', name: 'John Doe', closingBalance: 0 }];
    const onDelete = jest.fn();
    render(<PersonCards people={people} onCardSelect={jest.fn()} selected={null} onDelete={onDelete} />);
    const personCard = screen.getByText('John Doe');
    fireEvent.click(personCard);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith('1'));
  });
});
