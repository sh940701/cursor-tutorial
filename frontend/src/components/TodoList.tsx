import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string, priority?: number, dueDate?: string, description?: string) => void;
  lang: 'ko' | 'en';
  darkMode: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onEdit, lang, darkMode }) => {
  if (todos.length === 0) {
    return (
      <div className="p-5 max-h-96 overflow-y-auto">
        <div className="text-center py-10 text-gray-500">
          <div className="text-5xl mb-5 opacity-30">📋</div>
          <p>할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 max-h-96 overflow-y-auto">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default TodoList; 