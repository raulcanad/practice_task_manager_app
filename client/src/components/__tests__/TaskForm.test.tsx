import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskForm from '../TaskForm';

test('adds task when submitted', async () => {
  const user = userEvent.setup();
  const mockAdd = jest.fn().mockResolvedValue(undefined);
  
  const { getByPlaceholderText, getByRole } = render(<TaskForm onAddTask={mockAdd} />);
  
  await user.type(getByPlaceholderText('Nueva tarea...'), 'Test');
  await user.click(getByRole('button', { name: /añadir/i }));
  
  expect(mockAdd).toHaveBeenCalledWith('Test');
});

test('button is disabled when input empty', () => {
  const { getByRole } = render(<TaskForm onAddTask={jest.fn()} />);
  expect(getByRole('button', { name: /añadir/i })).toBeDisabled();
});