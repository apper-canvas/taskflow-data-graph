import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import ApperIcon from './ApperIcon'

const TaskCalendar = ({ tasks, categories, getCategoryById, getTaskStatus, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showTaskPopup, setShowTaskPopup] = useState(false)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), date)
    })
  }

  const handleDateClick = (date) => {
    const dateTasks = getTasksForDate(date)
    if (dateTasks.length > 0) {
      setSelectedDate(date)
      setShowTaskPopup(true)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500',
      urgent: 'bg-purple-500'
    }
    return colors[priority] || 'bg-surface-400'
  }

  const renderCalendarDays = () => {
    const days = []
    let day = startDate

    while (day <= endDate) {
      const currentDay = day
      const dayTasks = getTasksForDate(currentDay)
      const isCurrentMonth = isSameMonth(currentDay, monthStart)
      const isDayToday = isToday(currentDay)

      days.push(
        <motion.div
          key={currentDay.toISOString()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(currentDay)}
          className={`calendar-day ${
            isCurrentMonth ? 'calendar-day-current-month' : 'calendar-day-other-month'
          } ${
            isDayToday ? 'calendar-day-today' : ''
          } ${
            dayTasks.length > 0 ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <span className="text-sm font-medium">
            {format(currentDay, 'd')}
          </span>
          {dayTasks.length > 0 && (
            <div className="task-dots-container">
              {dayTasks.slice(0, 3).map((task, index) => (
                <div
                  key={task.id}
                  className={`task-dot ${getPriorityColor(task.priority)}`}
                  title={task.title}
                />
              ))}
              {dayTasks.length > 3 && (
                <span className="text-xs text-surface-500">+{dayTasks.length - 3}</span>
              )}
            </div>
          )}
        </motion.div>
      )
      day = addDays(day, 1)
    }

    return days
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon name="ChevronLeft" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Today
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon name="ChevronRight" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
          </motion.button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="calendar-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-header-day">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
        <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Priority Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-surface-600 dark:text-surface-400">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-surface-600 dark:text-surface-400">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-surface-600 dark:text-surface-400">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-surface-600 dark:text-surface-400">Urgent</span>
          </div>
        </div>
      </div>

      {/* Task Details Popup */}
      <AnimatePresence>
        {showTaskPopup && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTaskPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <button
                  onClick={() => setShowTaskPopup(false)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-3">
                {selectedDateTasks.map(task => {
                  const category = getCategoryById(task.categoryId)
                  const status = getTaskStatus(task)

                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onTaskClick && onTaskClick(task)}
                      className={`p-4 rounded-xl border border-surface-200 dark:border-surface-700 hover:shadow-md transition-all cursor-pointer task-priority-${task.priority}`}
                    >
                      <div className="flex items-start justify-between space-x-3">
                        <div className="flex-1">
                          <h4 className={`font-semibold ${status === 'completed' ? 'line-through text-surface-500' : 'text-surface-900 dark:text-surface-100'}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                              {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-3 mt-2 text-xs">
                            <span className={`status-badge status-${status}`}>
                              {status.replace('-', ' ')}
                            </span>
                            <span className="text-surface-500 capitalize">
                              {task.priority} priority
                            </span>
                            {category && (
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-surface-500">{category.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TaskCalendar
