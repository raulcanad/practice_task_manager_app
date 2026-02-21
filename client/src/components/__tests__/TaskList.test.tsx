import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskList from '../TaskList';

const tasks = [
  { id: 1, title: 'Task 1', completed: false }
];

test('renders tasks', () => {
  const { getByText } = render(
    <TaskList tasks={tasks} onToggleTask={jest.fn()} onDeleteTask={jest.fn()} />
  );
  expect(getByText('Task 1')).toBeInTheDocument();
});

test('calls onToggleTask when checkbox clicked', async () => {
  const user = userEvent.setup();
  const mockToggle = jest.fn();
  
  const { getByRole } = render(
    <TaskList tasks={tasks} onToggleTask={mockToggle} onDeleteTask={jest.fn()} />
  );
  
  await user.click(getByRole('checkbox'));
  expect(mockToggle).toHaveBeenCalledWith(1);
});