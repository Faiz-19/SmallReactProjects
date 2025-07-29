import React, { useState, useEffect } from 'react';

// ICONS: Using inline SVGs for icons to avoid external dependencies.
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);


// DUMMY DATA: Initial state for the Kanban board, used if localStorage is empty.
const initialTasks = {
  todo: [
    { id: 'task-1', content: 'Review project requirements' },
    { id: 'task-2', content: 'Create initial wireframes for the homepage' },
    { id: 'task-3', content: 'Set up the development environment' },
  ],
  inProgress: [
    { id: 'task-4', content: 'Develop the main navigation component' },
    { id: 'task-5', content: 'Integrate the authentication API' },
  ],
  done: [
    { id: 'task-6', content: 'Choose a color palette and typography' },
    { id: 'task-7', content: 'Design the database schema' },
  ],
};

// Main App Component
export default function App() {
  // Initialize state from localStorage or use initialTasks as a fallback.
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        return initialTasks;
      }
    }
    return initialTasks;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [editingTask, setEditingTask] = useState(null); // Will store {id, content, colId}
  const [targetColumn, setTargetColumn] = useState(null); 
  const [draggedItem, setDraggedItem] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);

  // --- Persist state to localStorage on any change to tasks ---
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Modal Handling ---
  const openAddModal = (colId) => {
    setTargetColumn(colId);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewTaskContent('');
    setTargetColumn(null);
  };
  
  const openEditModal = (task, colId) => {
    setEditingTask({ ...task, colId });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, task, colId) => {
    setDraggedItem(task);
    setSourceColumn(colId);
    e.currentTarget.classList.add('opacity-50', 'rotate-3');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50', 'rotate-3');
    setDraggedItem(null);
    setSourceColumn(null);
    document.querySelectorAll('.drop-zone-highlight').forEach(el => {
        el.classList.remove('drop-zone-highlight', 'bg-blue-100/50');
    });
  };
  
  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDragEnter = (e, colId) => {
    e.preventDefault();
    if (e.currentTarget.dataset.colId !== sourceColumn) {
        e.currentTarget.classList.add('drop-zone-highlight', 'bg-blue-100/50');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drop-zone-highlight', 'bg-blue-100/50');
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!draggedItem || sourceColumn === targetColId) return;
    setTasks(prevTasks => {
      const newTasks = JSON.parse(JSON.stringify(prevTasks));
      const taskIndex = newTasks[sourceColumn].findIndex(t => t.id === draggedItem.id);
      newTasks[sourceColumn].splice(taskIndex, 1);
      newTasks[targetColId].push(draggedItem);
      return newTasks;
    });
    e.currentTarget.classList.remove('drop-zone-highlight', 'bg-blue-100/50');
  };
  
  // --- Task CRUD Handlers ---
  const handleAddTask = () => {
    if (newTaskContent.trim() === '' || !targetColumn) return;
    const newTask = { id: `task-${new Date().getTime()}`, content: newTaskContent };
    setTasks(prevTasks => ({ ...prevTasks, [targetColumn]: [...prevTasks[targetColumn], newTask] }));
    closeAddModal();
  };

  const handleDeleteTask = (colId, taskId) => {
    setTasks(prev => ({
        ...prev,
        [colId]: prev[colId].filter(task => task.id !== taskId)
    }));
  };

  const handleUpdateTask = () => {
    if (!editingTask || !editingTask.content.trim()) return;
    
    const { id, content, colId } = editingTask;

    setTasks(prev => {
        const newColumnTasks = prev[colId].map(task => 
            task.id === id ? { ...task, content: content } : task
        );
        return { ...prev, [colId]: newColumnTasks };
    });

    closeEditModal();
  };


  // --- Column Definition ---
  const columns = {
    todo: { title: 'To Do', color: 'bg-red-500' },
    inProgress: { title: 'In Progress', color: 'bg-yellow-500' },
    done: { title: 'Done', color: 'bg-green-500' },
  };

  return (
    <div className="bg-slate-100 min-h-screen w-full font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-slate-500 mt-1">A modern, drag-and-drop interface for your tasks.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([colId, column]) => (
            <div
              key={colId}
              data-col-id={colId}
              className="bg-slate-200/70 rounded-xl p-4 transition-colors duration-300"
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, colId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, colId)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h2 className="font-bold text-lg">{column.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-slate-300 text-slate-600 text-sm font-semibold px-2 py-1 rounded-full">
                      {tasks[colId].length}
                    </span>
                    <button 
                        onClick={() => openAddModal(colId)}
                        className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-full p-1 transition-colors"
                    >
                        <PlusIcon />
                    </button>
                </div>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {tasks[colId].map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, colId)}
                    onDragEnd={handleDragEnd}
                    className="bg-white p-3.5 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing transition-all duration-200 group relative"
                  >
                    <p className="text-sm leading-relaxed pr-10">{task.content}</p>
                    <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(task, colId)} className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded">
                            <EditIcon />
                        </button>
                        <button onClick={() => handleDeleteTask(colId, task.id)} className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded">
                            <TrashIcon />
                        </button>
                    </div>
                  </div>
                ))}
                {tasks[colId].length === 0 && (
                    <div className="flex items-center justify-center text-center text-slate-400 border-2 border-dashed border-slate-300 rounded-lg p-6 h-full">
                        <p>Drop tasks here</p>
                    </div>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Add Task to "{columns[targetColumn]?.title}"</h3>
                    <button onClick={closeAddModal} className="text-slate-400 hover:text-slate-600"> <XIcon /> </button>
                </div>
                <textarea
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    placeholder="Enter task description..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    rows="4"
                ></textarea>
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button onClick={closeAddModal} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition"> Cancel </button>
                    <button onClick={handleAddTask} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition"> Add Task </button>
                </div>
            </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Edit Task</h3>
                    <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600"> <XIcon /> </button>
                </div>
                <textarea
                    value={editingTask.content}
                    onChange={(e) => setEditingTask({...editingTask, content: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    rows="4"
                ></textarea>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={closeEditModal} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition"> Cancel </button>
                    <button onClick={handleUpdateTask} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition"> Save Changes </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
