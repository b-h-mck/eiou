import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TxnList from '../../../src/features/Txn/TxnList';
import { TxnEditableFields, TxnCalculations } from '../../../src/features/Txn/TxnModel';
import { TxnsDB } from '../../../src/shared/store';

// Mock external dependencies
jest.mock('../../../src/shared/store', () => ({
  TxnsDB: {
    delete: jest.fn(),
  },
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

describe('TxnList Component', () => {
  const defaultProps = {
    txns: [
      {
        id: '1',
        date: new Date().toISOString(),
        description: 'Test transaction',
        fullAmount: 100,
        finalAmount: 100,
        personName: 'John Doe',
        balanceBefore: 0,
        balanceAfter: 100,
        type: 'iOwe',
      },
    ] as TxnCalculations[],
    selectedTxnId: null,
    onSelectTxn: jest.fn(),
    onDeleteTxn: jest.fn(),
    editingTxn: null,
    onEditingTxnChange: jest.fn(),
    onTxnSave: jest.fn(),
    onTxnDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render TxnList component', () => {
    render(<TxnList {...defaultProps} />);
    expect(screen.getByText('Test transaction')).toBeInTheDocument();
  });

  test('should allow user to select a transaction', async () => {
    render(<TxnList {...defaultProps} />);
    const txnRow = screen.getByText('Test transaction');
    fireEvent.click(txnRow);
    await waitFor(() => expect(defaultProps.onSelectTxn).toHaveBeenCalledWith('1'));
  });

  test('should allow user to delete a transaction', async () => {
    render(<TxnList {...defaultProps} selectedTxnId="1" editingTxn={defaultProps.txns[0]} />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    await waitFor(() => expect(TxnsDB.delete).toHaveBeenCalledWith('1'));
  });

  test('should allow user to save a transaction', async () => {
    render(<TxnList {...defaultProps} selectedTxnId="1" editingTxn={defaultProps.txns[0]} />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => expect(defaultProps.onTxnSave).toHaveBeenCalledWith('1', defaultProps.txns[0]));
  });

  test('should allow user to cancel editing a transaction', async () => {
    render(<TxnList {...defaultProps} selectedTxnId="1" editingTxn={defaultProps.txns[0]} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    await waitFor(() => expect(defaultProps.onSelectTxn).toHaveBeenCalledWith(null));
  });
});
