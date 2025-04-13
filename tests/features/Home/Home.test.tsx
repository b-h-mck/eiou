import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../../../src/features/Home/Home';
import { PeopleDB, TxnsDB } from '../../../src/shared/store';
import { Mode } from '../../../src/features/Home/ModeSelector';
import { PersonEditableFields } from '../../../src/features/Person/PersonModel';
import { TxnEditableFields } from '../../../src/features/Txn/TxnModel';

// Mock external dependencies
jest.mock('../../../src/shared/store', () => ({
  PeopleDB: {
    getAll: jest.fn(),
    put: jest.fn(),
  },
  TxnsDB: {
    getAll: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render Home component', () => {
    render(<Home />);
    expect(screen.getByText('Start here')).toBeInTheDocument();
  });

  test('should allow user to select a mode', async () => {
    render(<Home />);
    const iOweButton = screen.getByText('I owe someone');
    fireEvent.click(iOweButton);
    await waitFor(() => expect(iOweButton).toHaveClass('selected'));
  });

  test('should allow user to create a new person', async () => {
    (PeopleDB.getAll as jest.Mock).mockResolvedValue([]);
    render(<Home />);
    const addNewButton = screen.getByText('+ Add New');
    fireEvent.click(addNewButton);
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => expect(PeopleDB.put).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe' })));
  });

  test('should allow user to create a new transaction', async () => {
    (PeopleDB.getAll as jest.Mock).mockResolvedValue([{ id: '1', name: 'John Doe' }]);
    (TxnsDB.getAll as jest.Mock).mockResolvedValue([]);
    render(<Home />);
    const iOweButton = screen.getByText('I owe someone');
    fireEvent.click(iOweButton);
    await waitFor(() => expect(iOweButton).toHaveClass('selected'));
    const personCard = screen.getByText('John Doe');
    fireEvent.click(personCard);
    const amountInput = screen.getByLabelText('Full amount:');
    fireEvent.change(amountInput, { target: { value: '50' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => expect(TxnsDB.put).toHaveBeenCalledWith(expect.objectContaining({ fullAmount: 50 })));
  });

  test('should allow user to update a transaction', async () => {
    (PeopleDB.getAll as jest.Mock).mockResolvedValue([{ id: '1', name: 'John Doe' }]);
    (TxnsDB.getAll as jest.Mock).mockResolvedValue([{ id: 'txn-1', personId: '1', fullAmount: 50 }]);
    render(<Home />);
    const personCard = screen.getByText('John Doe');
    fireEvent.click(personCard);
    const txnRow = screen.getByText('50');
    fireEvent.click(txnRow);
    const amountInput = screen.getByLabelText('Full amount:');
    fireEvent.change(amountInput, { target: { value: '100' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => expect(TxnsDB.put).toHaveBeenCalledWith(expect.objectContaining({ fullAmount: 100 })));
  });

  test('should allow user to delete a transaction', async () => {
    (PeopleDB.getAll as jest.Mock).mockResolvedValue([{ id: '1', name: 'John Doe' }]);
    (TxnsDB.getAll as jest.Mock).mockResolvedValue([{ id: 'txn-1', personId: '1', fullAmount: 50 }]);
    render(<Home />);
    const personCard = screen.getByText('John Doe');
    fireEvent.click(personCard);
    const txnRow = screen.getByText('50');
    fireEvent.click(txnRow);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    await waitFor(() => expect(TxnsDB.delete).toHaveBeenCalledWith('txn-1'));
  });
});
