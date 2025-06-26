import React, { useState, useEffect } from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string, priority?: number, dueDate?: string, description?: string) => void;
  onDelete: (id: number) => void;
  darkMode: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete, darkMode }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>(todo.text);
  const [editedPriority, setEditedPriority] = useState<number>(todo.priority);
  const [editedDueDate, setEditedDueDate] = useState<string>(todo.dueDate || '');
  const [editedDescription, setEditedDescription] = useState<string>(todo.description || '');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditedText(todo.text);
      setEditedPriority(todo.priority);
      setEditedDueDate(todo.dueDate || '');
      setEditedDescription(todo.description || '');
    }
  }, [isEditing, todo]);

  const handleEdit = (): void => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    const trimmedText = editedText.trim();
    if (trimmedText) {
      onEdit(todo.id, trimmedText, editedPriority, editedDueDate, editedDescription);
    }
    setIsEditing(false);
  };
  
  const handlePriorityChange = (newPriority: number): void => {
    if (isEditing) {
      setEditedPriority(newPriority);
    } else {
      // 보기 모드에서는 즉시 업데이트
      onEdit(todo.id, todo.text, newPriority, todo.dueDate, todo.description);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) { // shift+enter는 줄바꿈 허용
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };
  
  return (
    <div
      className={`relative p-6 my-3 rounded-xl shadow-lg transition-all duration-300 border-l-8 ${
        todo.completed ? 'bg-gray-200 dark:bg-gray-700 border-green-500' : `${darkMode ? 'bg-gray-800' : 'bg-white'} border-blue-500`
      } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 gap-4">
          <input
            type="checkbox"
            className="w-7 h-7 mt-1 rounded-full cursor-pointer accent-blue-600 focus:ring-blue-500"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                className={`w-full text-xl font-bold px-3 py-2 border-2 rounded-lg focus:outline-none transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
            ) : (
              <p 
                className={`text-xl font-bold cursor-pointer ${darkMode ? 'text-white' : 'text-gray-900'} ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                onClick={() => setIsEditing(true)}
              >
                {todo.text}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
               {[1, 2, 3, 4, 5].map((star) => (
                 <span
                   key={star}
                   className={`cursor-pointer text-2xl transition-transform duration-200 hover:scale-125 ${
                     (isEditing ? editedPriority : todo.priority) >= star ? 'text-yellow-400' : (darkMode ? 'text-gray-600' : 'text-gray-300')
                   }`}
                   onClick={() => handlePriorityChange(star)}
                 >
                   ★
                 </span>
               ))}
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDetails(!showDetails)} className={`px-3 py-1 text-sm rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {showDetails ? '숨기기' : '상세'}
          </button>
          <button onClick={handleEdit} className={`px-4 py-2 text-white rounded-lg ${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
            {isEditing ? '저장' : '수정'}
          </button>
          <button onClick={() => onDelete(todo.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            삭제
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>마감일</label>
            <input
              type="date"
              className={`w-full mt-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400' : 'bg-white border-gray-300 focus:border-blue-500'}`}
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>설명</label>
            <textarea
              className={`w-full mt-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400' : 'bg-white border-gray-300 focus:border-blue-500'}`}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={3}
              placeholder="상세 설명 (최대 200자)"
            />
          </div>
        </div>
      ) : (
        showDetails && (
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {todo.dueDate && <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><span className="font-semibold">마감일:</span> {todo.dueDate}</p>}
            {todo.description && <p className={`mt-2 text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{todo.description}</p>}
          </div>
        )
      )}
    </div>
  );
};

export default TodoItem; 