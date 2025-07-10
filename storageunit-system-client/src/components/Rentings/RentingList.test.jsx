import { render, screen, fireEvent } from '@testing-library/react';
import RentingList from './RentingList';
import '@testing-library/jest-dom';


// Dummy notify hook ersetzen, damit kein Fehler entsteht
jest.mock('../Notification/useNotify', () => () => jest.fn());

describe('RentingList Component', () => {
  const sampleRentings = [
    {
      id: 1,
      user: { userName: 'Alice' },
      storageUnit: { name: 'Unit A' },
      startDate: '2023-01-01',
      endDate: '2023-06-01',
    },
    {
      id: 2,
      user: { userName: 'Bob' },
      storageUnit: { name: 'Unit B' },
      startDate: '2023-02-01',
      endDate: '2023-07-01',
    },
  ];

  test('zeigt "No rentings found" wenn Liste leer ist', () => {
    render(<RentingList rentings={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('No rentings found.')).toBeInTheDocument();
  });

  test('rendert Liste von Mietobjekten korrekt', () => {
    render(<RentingList rentings={sampleRentings} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Unit A')).toBeInTheDocument();
    expect(screen.getByText('2023-06-01')).toBeInTheDocument();
    expect(screen.getAllByText('Edit')).toHaveLength(2);
    expect(screen.getAllByText('Delete')).toHaveLength(2);
  });

  test('ruft onEdit auf, wenn Edit-Button geklickt wird', () => {
    const mockEdit = jest.fn();
    render(<RentingList rentings={sampleRentings} onEdit={mockEdit} onDelete={() => {}} />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockEdit).toHaveBeenCalledWith(sampleRentings[0]);
  });

  test('ruft onDelete auf, wenn Delete-Button geklickt wird', () => {
    const mockDelete = jest.fn();
    render(<RentingList rentings={sampleRentings} onEdit={() => {}} onDelete={mockDelete} />);
    fireEvent.click(screen.getAllByText('Delete')[1]);
    expect(mockDelete).toHaveBeenCalledWith(2);
  });
});
