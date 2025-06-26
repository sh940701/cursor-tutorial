import React, { useState } from 'react';

interface TodoInputProps {
  onAddTodo: (text: string, priority: number, dueDate?: string, description?: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [text, setText] = useState<string>('');
  const [priority, setPriority] = useState<number>(3);
  const [dueDate, setDueDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddTodo(trimmedText, priority, dueDate || undefined, description || undefined);
      setText('');
      setPriority(3);
      setDueDate('');
      setDescription('');
    }
  };

  return (
    <div className="p-8 border-b border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-stretch">
        <input
          type="text"
          className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요..."
          maxLength={100}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">중요도</span>
          {[1,2,3,4,5].map((num) => (
            <button
              type="button"
              key={num}
              className={
                `text-xl ${priority >= num ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
              onClick={() => setPriority(num)}
              aria-label={`중요도 ${num}점`}
            >
              ★
            </button>
          ))}
        </div>
        <input
          type="date"
          className="px-3 py-2 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="마감일"
        />
        <input
          type="text"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상세 설명 (선택)"
          maxLength={200}
        />
        <button 
          type="submit" 
          className="px-6 py-4 bg-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-bold transition-transform hover:-translate-y-0.5"
        >
          추가
        </button>
      </form>
    </div>
  );
};

export default TodoInput; 