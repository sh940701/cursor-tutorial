import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';
import TodoStats from './components/TodoStats';
import ActionButtons from './components/ActionButtons';
import Alert from './components/Alert';
import { Todo, Alert as AlertType } from './types';
// @ts-ignore: No types for react-water-wave
import WaterWave from 'react-water-wave';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'important'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'created' | 'priority' | 'dueDate'>('created');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [darkMode, setDarkMode] = useState(false);
  const [mouseX, setMouseX] = useState(0.5);
  const bgRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; key: number }[]>([]);
  const rippleKey = useRef(0);
  const appContainerRef = useRef<HTMLDivElement>(null);

  // 알림 표시 함수
  const showAlert = (message: string, type: AlertType['type'] = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // 모든 할 일 조회
  const fetchTodos = async (): Promise<void> => {
    try {
      const response = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      showAlert('할 일을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 할 일 추가
  const addTodo = async (text: string, priority: number, dueDate?: string, description?: string): Promise<void> => {
    try {
      const response = await axios.post<Todo>(`${API_BASE_URL}/todos`, { text, priority, dueDate, description });
      setTodos(prev => [...prev, response.data]);
      showAlert(lang === 'ko' ? '할 일이 추가되었습니다!' : 'Todo added!', 'success');
    } catch (error: any) {
      const message = error.response?.data?.error || (lang === 'ko' ? '할 일 추가에 실패했습니다.' : 'Failed to add todo.');
      showAlert(message, 'error');
    }
  };

  // 할 일 토글 (완료/미완료)
  const toggleTodo = async (id: number): Promise<void> => {
    try {
      const todo = todos.find(t => t.id === id);
      const response = await axios.put<Todo>(`${API_BASE_URL}/todos/${id}`, {
        completed: !todo?.completed
      });
      
      setTodos(prev => prev.map(t => 
        t.id === id ? response.data : t
      ));
    } catch (error) {
      showAlert('할 일 상태 변경에 실패했습니다.', 'error');
    }
  };

  // 할 일 수정
  const editTodo = async (id: number, newText: string, priority?: number, dueDate?: string, description?: string): Promise<void> => {
    try {
      const payload: { text: string; priority?: number; dueDate?: string, description?: string } = {
        text: newText,
      };

      if (priority !== undefined) {
        payload.priority = priority;
      }
      // dueDate가 유효한 값일 때만 포함
      if (dueDate) {
        payload.dueDate = dueDate;
      }
      // description이 undefined가 아닐 때만 포함
      if (description !== undefined) {
        payload.description = description;
      }

      const response = await axios.put<Todo>(`${API_BASE_URL}/todos/${id}`, payload);
      
      setTodos(prev => prev.map(t => t.id === id ? response.data : t));
      showAlert(lang === 'ko' ? '할 일이 수정되었습니다!' : 'Todo updated!', 'success');
    } catch (error: any) {
      const message = error.response?.data?.error || (lang === 'ko' ? '할 일 수정에 실패했습니다.' : 'Failed to update todo.');
      showAlert(message, 'error');
    }
  };

  // 할 일 삭제
  const deleteTodo = async (id: number): Promise<void> => {
    if (!window.confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
      showAlert('할 일이 삭제되었습니다!', 'info');
    } catch (error) {
      showAlert('할 일 삭제에 실패했습니다.', 'error');
    }
  };

  // 완료된 할 일 모두 삭제
  const deleteCompletedTodos = async (): Promise<void> => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
      showAlert('완료된 할 일이 없습니다!', 'warning');
      return;
    }

    if (!window.confirm(`완료된 할 일 ${completedCount}개를 모두 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/todos/bulk-completed`);
      setTodos(prev => prev.filter(t => !t.completed));
      showAlert(response.data.message, 'info');
    } catch (error) {
      showAlert('완료된 할 일 삭제에 실패했습니다.', 'error');
    }
  };

  // 모든 할 일 삭제
  const clearAllTodos = async (): Promise<void> => {
    if (todos.length === 0) {
      showAlert('삭제할 할 일이 없습니다!', 'warning');
      return;
    }

    if (!window.confirm('모든 할 일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/todos`);
      setTodos([]);
      showAlert(response.data.message, 'info');
    } catch (error) {
      showAlert('모든 할 일 삭제에 실패했습니다.', 'error');
    }
  };

  // 필터/검색/정렬/숨기기 적용된 todos
  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      if (filter === 'important') return todo.priority >= 4;
      return true;
    })
    .filter(todo => {
      if (!search) return true;
      return todo.text.toLowerCase().includes(search.toLowerCase()) || (todo.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    })
    .filter(todo => (hideCompleted ? !todo.completed : true))
    .sort((a, b) => {
      if (sort === 'priority') return b.priority - a.priority;
      if (sort === 'dueDate') return (a.dueDate || '').localeCompare(b.dueDate || '');
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  // 컴포넌트 마운트 시 할 일 목록 로드
  useEffect(() => {
    fetchTodos();
  }, []);

  // 파도 곡선 마우스 연동
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!bgRef.current) return;
    const rect = bgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setMouseX(Math.max(0, Math.min(1, x)));
  };

  // clip-path 동적 생성
  const y1 = 80 + 40 * (mouseX - 0.5); // -20~+20
  const y2 = 80 - 40 * (mouseX - 0.5); // +20~-20
  const y3 = 80 + 40 * (0.5 - mouseX); // -20~+20
  const wavePath = `path('M0,80 Q360,${y1} 720,${y2} T1440,${y3} V320H0Z')`;

  // Ripple effect handler (now on mouse move)
  const handleRipple = (e: React.MouseEvent) => {
    if (!appContainerRef.current) return;
    const rect = appContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const key = rippleKey.current++;
    setRipples((prev) => [...prev, { x, y, key }]);
  };

  // Remove ripple after animation
  useEffect(() => {
    if (ripples.length === 0) return;
    const timeout = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 700);
    return () => clearTimeout(timeout);
  }, [ripples]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 p-5">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-2">🏊‍♂️ Todo App</h1>
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WaterWave
      //imageUrl="/water-drops.jpg" // Let CSS handle the background
      className="waterwave-bg"
      dropRadius={30}
      perturbance={0.04}
      resolution={512}
      interactive={true}
      crossOrigin="anonymous"
    >
      {() => (
        <div className="relative min-h-screen w-full overflow-x-hidden transition-colors duration-500 flex items-center justify-center" style={{zIndex: 1}}>
          <div
            ref={appContainerRef}
            className={`relative w-[90vw] max-w-4xl min-h-[90vh] mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 backdrop-blur-lg border-4 border-blue-300 z-10`}
          >
            <div className={`p-12 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-transparent text-blue-900'}`}> 
              <h1 className="text-6xl font-extrabold mb-4 flex items-center justify-center gap-4 drop-shadow-lg tracking-tight">
                <span role="img" aria-label="logo">🌊</span> Todo App <span role="img" aria-label="surf">🏄‍♂️</span>
              </h1>
              <p className="text-2xl font-semibold tracking-wide drop-shadow-md">{lang === 'ko' ? '파도 위에서 역동적으로 할 일을 관리해보세요!' : 'Ride the wave and manage your todos dynamically!'}</p>
            </div>
            {/* 상단 컨트롤 바 */}
            <div className={`flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between px-10 py-6 border-b-2 ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-blue-200 bg-blue-50'}`}> 
              <input
                type="text"
                className={`flex-1 min-w-[160px] px-5 py-4 text-xl rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-blue-300'}`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'ko' ? '검색...' : 'Search...'}
              />
              <select
                className={`px-4 py-4 rounded-xl border-2 text-lg min-w-[120px] ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-blue-300'}`}
                value={filter}
                onChange={e => setFilter(e.target.value as any)}
              >
                <option value="all">{lang === 'ko' ? '전체' : 'All'}</option>
                <option value="active">{lang === 'ko' ? '미완료' : 'Active'}</option>
                <option value="completed">{lang === 'ko' ? '완료' : 'Completed'}</option>
                <option value="important">{lang === 'ko' ? '중요' : 'Important'}</option>
              </select>
              <select
                className={`px-4 py-4 rounded-xl border-2 text-lg min-w-[120px] ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-blue-300'}`}
                value={sort}
                onChange={e => setSort(e.target.value as any)}
              >
                <option value="created">{lang === 'ko' ? '생성순' : 'Created'}</option>
                <option value="priority">{lang === 'ko' ? '중요도순' : 'Priority'}</option>
                <option value="dueDate">{lang === 'ko' ? '마감일순' : 'Due date'}</option>
              </select>
              <button
                className={`px-5 py-4 rounded-xl border-2 text-lg font-bold transition min-w-[120px] ${hideCompleted ? 'bg-blue-500 text-white' : ''} ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-blue-300'}`}
                onClick={() => setHideCompleted(v => !v)}
              >
                {hideCompleted ? (lang === 'ko' ? '완료 숨김' : 'Hide Completed') : (lang === 'ko' ? '완료 보임' : 'Show Completed')}
              </button>
              <button
                className={`px-5 py-4 rounded-xl border-2 text-lg font-bold transition min-w-[120px] ${darkMode ? 'bg-gray-700 text-yellow-300 border-gray-600' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}`}
                onClick={() => setLang(l => l === 'ko' ? 'en' : 'ko')}
              >
                {lang === 'ko' ? '🇰🇷 한글' : '🇺🇸 English'}
              </button>
              <button
                className={`px-5 py-4 rounded-xl border-2 text-lg font-bold transition min-w-[120px] ${darkMode ? 'bg-gray-700 text-blue-300 border-gray-600' : 'bg-blue-100 text-blue-700 border-blue-300'}`}
                onClick={() => setDarkMode(d => !d)}
              >
                {darkMode ? '🌙 다크' : '☀️ 라이트'}
              </button>
            </div>
            {/* 입력창, 리스트, 통계, 액션버튼, 알림 */}
            <div className="flex-1 flex flex-col">
              <TodoInput onAddTodo={addTodo} />
              <div className="flex-1 overflow-y-auto">
                <TodoList 
                  todos={filteredTodos}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                  lang={lang}
                  darkMode={darkMode}
                />
              </div>
              <TodoStats todos={filteredTodos} />
              <ActionButtons 
                onDeleteCompleted={deleteCompletedTodos}
                onClearAll={clearAllTodos}
                hasTodos={filteredTodos.length > 0}
                hasCompletedTodos={filteredTodos.some(t => t.completed)}
              />
            </div>
            {alert && (
              <Alert 
                message={alert.message} 
                type={alert.type} 
                onClose={() => setAlert(null)}
              />
            )}
          </div>
        </div>
      )}
    </WaterWave>
  );
}

export default App; 