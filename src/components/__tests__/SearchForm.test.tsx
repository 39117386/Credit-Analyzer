import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../SearchForm';

describe('SearchForm', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    expect(screen.getByText('Consultar Deudas BCRA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789 o 20-12345678-9)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Consultar' })).toBeInTheDocument();
  });

  it('debe llamar onSearch con el CUIT cuando se hace submit', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789 o 20-12345678-9)');
    const button = screen.getByRole('button', { name: 'Consultar' });

    await user.type(input, '20123456789');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('20123456789');
  });

  it('debe aceptar CUIT con guiones', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789 o 20-12345678-9)');
    const button = screen.getByRole('button', { name: 'Consultar' });

    await user.type(input, '20-12345678-9');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('20-12345678-9');
  });

  it('debe mostrar error para CUIT con menos de 11 dígitos', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789 o 20-12345678-9)');
    const button = screen.getByRole('button', { name: 'Consultar' });

    await user.type(input, '123456789');
    await user.click(button);

    expect(screen.getByText('El CUIT debe tener exactamente 11 dígitos')).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('debe mostrar error para CUIT vacío', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const button = screen.getByRole('button', { name: 'Consultar' });
    await user.click(button);

    expect(screen.getByText('Ingrese un CUIT')).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('debe deshabilitar el botón cuando está cargando', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={true} />);

    const button = screen.getByRole('button', { name: 'Consultando...' });
    expect(button).toBeDisabled();
  });

  it('debe deshabilitar el botón cuando el input está vacío', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const button = screen.getByRole('button', { name: 'Consultar' });
    expect(button).toBeDisabled();
  });

  it('debe deshabilitar el botón cuando el CUIT no es válido', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789 o 20-12345678-9)');
    const button = screen.getByRole('button', { name: 'Consultar' });

    await user.type(input, '12345');
    expect(button).toBeDisabled();
  });

  it('debe habilitar el botón cuando el CUIT es válido', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789 o 20-12345678-9)');
    const button = screen.getByRole('button', { name: 'Consultar' });

    await user.type(input, '20123456789');
    expect(button).not.toBeDisabled();
  });

  it('debe habilitar el botón cuando hay texto en el input', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789)');
    const button = screen.getByRole('button', { name: 'Consultar' });

    await user.type(input, '20123456789');

    expect(button).not.toBeDisabled();
  });

  it('debe prevenir el submit por defecto', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const form = screen.getByRole('form');
    const input = screen.getByPlaceholderText('Ingrese CUIT (ej: 20123456789)');

    await user.type(input, '20123456789');

    const mockPreventDefault = jest.fn();
    const mockEvent = { preventDefault: mockPreventDefault };

    fireEvent.submit(form, mockEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
  });
});