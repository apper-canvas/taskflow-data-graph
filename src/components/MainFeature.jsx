import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import ApperIcon from './ApperIcon'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">
              Categories
            </h2>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-surface-50 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Layers" className="w-5 h-5" />
                  <span className="font-medium">All Tasks</span>
                </div>
                <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {tasks.length}
                </span>
              </motion.button>

              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-surface-50 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded-full">
                    {category.taskCount}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Status Filters */}
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mt-8 mb-4">
              Status
            </h3>
            <div className="space-y-2">
              {[
                { key: 'all', label: 'All', icon: 'List' },
                { key: 'pending', label: 'Pending', icon: 'Clock' },
                { key: 'in-progress', label: 'In Progress', icon: 'Play' },
                { key: 'completed', label: 'Completed', icon: 'CheckCircle' },
                { key: 'overdue', label: 'Overdue', icon: 'AlertCircle' }
              ].map(status => (
                <motion.button
                  key={status.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStatus(status.key)}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
                    selectedStatus === status.key 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'
                  }`}
                >
                  <ApperIcon name={status.icon} className="w-4 h-4" />
                  <span className="font-medium">{status.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

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
          </motion.div>

          {/* Task Form Modal */}
          <AnimatePresence>
            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowTaskForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl p-6 w-full max-w-md"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                      {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h3>
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                        className="form-input"
                        placeholder="Enter task title..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={taskForm.description}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                        className="form-input min-h-[80px] resize-none"
                        placeholder="Add task description..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={taskForm.priority}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                          className="form-input"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Category
                        </label>
                        <select
                          value={taskForm.categoryId}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, categoryId: e.target.value }))}
                          className="form-input"
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="form-input"
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowTaskForm(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1"
                      >
                        {editingTask ? 'Update' : 'Create'} Task
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tasks List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 bg-white dark:bg-surface-800 rounded-2xl shadow-card"
                >
                  <ApperIcon name="ListTodo" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-surface-500 dark:text-surface-400">
                    Create your first task to get started!
                  </p>
                </motion.div>
              ) : (
                filteredTasks.map((task, index) => {
                  const category = getCategoryById(task.categoryId)
                  const status = getTaskStatus(task)
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`task-card p-6 task-priority-${task.priority}`}
                    >
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              status === 'completed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                            }`}
                          >
                            {status === 'completed' && (
                              <ApperIcon name="Check" className="w-4 h-4 text-white" />
                            )}
                          </motion.button>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`font-semibold text-lg ${
                                status === 'completed' 
                                  ? 'line-through text-surface-500' 
                                  : 'text-surface-900 dark:text-surface-100'
                              }`}>
                                {task.title}
                              </h3>
                              <span className={`status-badge status-${status}`}>
                                {status.replace('-', ' ')}
                              </span>
                            </div>

                            {task.description && (
                              <p className="text-surface-600 dark:text-surface-400 mb-3">
                                {task.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <ApperIcon 
                                  name={getPriorityIcon(task.priority)} 
                                  className={`w-4 h-4 ${getPriorityColor(task.priority)}`} 
                                />
                                <span className="text-surface-600 dark:text-surface-400 capitalize">
                                  {task.priority} priority
                                </span>
                              </div>

                              {category && (
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span className="text-surface-600 dark:text-surface-400">
                                    {category.name}
                                  </span>
                                </div>
                              )}

                              {task.dueDate && (
                                <div className="flex items-center space-x-2">
                                  <ApperIcon name="Calendar" className="w-4 h-4 text-surface-500" />
                                  <span className={`${
                                    status === 'overdue' ? 'text-red-600' : 'text-surface-600 dark:text-surface-400'
                                  }`}>
                                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(task)}
                            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                          >
                            <ApperIcon name="Edit3" className="w-4 h-4 text-surface-500" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(task.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature