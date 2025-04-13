import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TxnEdit from '../../../src/features/Txn/TxnEdit';
import { TxnEditableFields, TxnType } from '../../../src/features/Txn/TxnModel';
import { formatCurrency, useOptions } from '../../../src/features/Settings/OptionsModel';

// Mock external dependencies
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

jest.mock('../../../src/features/Settings/OptionsModel', () => ({
  formatCurrency: jest.fn((amount) => `$${amount.toFixed(2)}`),
  useOptions: jest.fn(() => ({
    maxAmount: 1000,
    stepAmount: 1,
  })),
}));

describe('TxnEdit Component', () => {
  const defaultProps = {
    type: 'iOwe' as TxnType,
    txn: {
      description: '',
      notes: '',
      date: new Date().toISOString(),
      fullAmount: 10,
      splitWithMe: false,
    } as TxnEditableFields,
    isEditingExistingTxn: false,
    onChange: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn(),
    onDelete: jest.fn(),
    deleteVisible: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render TxnEdit component', () => {
    render(<TxnEdit {...defaultProps} />);
    expect(screen.getByText('Full amount:')).toBeInTheDocument();
  });

  test('should allow user to change description', () => {
    render(<TxnEdit {...defaultProps} />);
    const descriptionInput = screen.getByLabelText('Description:');
    fireEvent.change(descriptionInput, { target: { value: 'New description' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.objectContaining({ description: 'New description' }));
  });

  test('should allow user to change full amount', () => {
    render(<TxnEdit {...defaultProps} />);
    const amountInput = screen.getByLabelText('Full amount:');
    fireEvent.change(amountInput, { target: { value: '50' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.objectContaining({ fullAmount: 50 }));
  });

  test('should allow user to save transaction', () => {
    render(<TxnEdit {...defaultProps} />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(defaultProps.onSave).toHaveBeenCalledWith(defaultProps.txn);
  });

  test('should allow user to cancel transaction', () => {
    render(<TxnEdit {...defaultProps} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  test('should allow user to delete transaction if deleteVisible is true', () => {
    render(<TxnEdit {...defaultProps} deleteVisible={true} />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });
});
