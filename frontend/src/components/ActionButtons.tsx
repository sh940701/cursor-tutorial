import React from 'react';

interface ActionButtonsProps {
  onDeleteCompleted: () => void;
  onClearAll: () => void;
  hasTodos: boolean;
  hasCompletedTodos: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onDeleteCompleted, 
  onClearAll, 
  hasTodos, 
  hasCompletedTodos 
}) => {
  return (
    <div className="p-5 flex gap-3 justify-center">
      <button 
        className="px-5 py-2 bg-orange-500 text-white border-none rounded cursor-pointer text-sm transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onDeleteCompleted}
        disabled={!hasCompletedTodos}
      >
        완료된 할 일 삭제
      </button>
      <button 
        className="px-5 py-2 bg-gray-500 text-white border-none rounded cursor-pointer text-sm transition-colors hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClearAll}
        disabled={!hasTodos}
      >
        모든 할 일 삭제
      </button>
    </div>
  );
};

export default ActionButtons; 