import React from 'react';
import { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
}

const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const remaining = total - completed;

  return (
    <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-between text-sm text-gray-600">
      <span>전체: {total}개</span>
      <span>완료: {completed}개</span>
      <span>남은: {remaining}개</span>
    </div>
  );
};

export default TodoStats; 