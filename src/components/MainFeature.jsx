import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { isBefore } from 'date-fns'
import ApperIcon from './ApperIcon'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import TaskCalendar from './TaskCalendar'
import TaskFilters from './TaskFilters'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([
    { id: '1', name: 'Personal', color: '#6366f1', taskCount: 0 },
    { id: '2', name: 'Work', color: '#06b6d4', taskCount: 0 },
    { id: '3', name: 'Shopping', color: '#f59e0b', taskCount: 0 }
  ])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '1'
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    const savedCategories = localStorage.getItem('taskflow-categories')
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [])

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
    updateCategoryCounts()
  }, [tasks])

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow-categories', JSON.stringify(categories))
  }, [categories])

  const updateCategoryCounts = () => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      taskCount: tasks.filter(task => task.categoryId === cat.id && task.status !== 'completed').length
    })))
  }

  const getTaskStatus = (task) => {
    if (task.status === 'completed') return 'completed'
    if (task.dueDate && isBefore(new Date(task.dueDate), new Date())) return 'overdue'
    if (task.status === 'in-progress') return 'in-progress'
    return 'pending'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      toast.error('Task title is required')
      return
    }

    const now = new Date()
    
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { 
              ...task, 
              ...taskForm, 
              updatedAt: now.toISOString(),
              status: getTaskStatus({ ...task, ...taskForm })
            }
          : task
      ))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskForm,
        status: 'pending',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        isRecurring: false
      }
      setTasks(prev => [...prev, newTask])
      toast.success('Task created successfully!')
    }

    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      categoryId: '1'
    })
    setShowTaskForm(false)
  }

  const handleEdit = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryId: task.categoryId
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return task
    }))
  }

  const filteredTasks = tasks.filter(task => {
    const statusMatch = selectedStatus === 'all' || getTaskStatus(task) === selectedStatus
    const categoryMatch = selectedCategory === 'all' || task.categoryId === selectedCategory
    return statusMatch && categoryMatch
  })

  const getCategoryById = (id) => categories.find(cat => cat.id === id)

  const getPriorityIcon = (priority) => {
    const icons = {
      low: 'ArrowDown',
      medium: 'Minus',
      high: 'ArrowUp',
      urgent: 'Zap'
    }
    return icons[priority] || 'Minus'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-amber-600',
      high: 'text-red-600',
      urgent: 'text-purple-600'
    }
    return colors[priority] || 'text-amber-600'
  }

  const handleTaskClick = (task) => {
    handleEdit(task)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <TaskFilters 
          categories={categories}
          tasks={tasks}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0"
          >
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                My Tasks
              </h1>
              <p className="text-surface-600 dark:text-surface-400 mt-1">
                {filteredTasks.length} tasks found
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-surface-100 dark:bg-surface-700 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-surface-800 shadow-sm text-primary' 
                      : 'text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                  <span className="text-sm font-medium">List</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'calendar' 
                      ? 'bg-white dark:bg-surface-800 shadow-sm text-primary' 
                      : 'text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span className="text-sm font-medium">Calendar</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowTaskForm(true)
                  setEditingTask(null)
                  setTaskForm({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                    categoryId: '1'
                  })
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>Add Task</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Task Form Modal */}
          <AnimatePresence>
            <TaskForm 
              showTaskForm={showTaskForm}
              setShowTaskForm={setShowTaskForm}
              editingTask={editingTask}
              taskForm={taskForm}
              setTaskForm={setTaskForm}
              categories={categories}
              handleSubmit={handleSubmit}
            />
          </AnimatePresence>

          {/* Content Views */}
          {viewMode === 'list' ? (
            <TaskList 
              filteredTasks={filteredTasks}
              getCategoryById={getCategoryById}
              getTaskStatus={getTaskStatus}
              toggleTaskStatus={toggleTaskStatus}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              getPriorityIcon={getPriorityIcon}
              getPriorityColor={getPriorityColor}
            />
          ) : (
            <TaskCalendar 
              tasks={filteredTasks}
              categories={categories}
              getCategoryById={getCategoryById}
              getTaskStatus={getTaskStatus}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MainFeature
