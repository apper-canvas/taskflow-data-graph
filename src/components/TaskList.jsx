import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const TaskList = ({ 
  filteredTasks, 
  getCategoryById, 
  getTaskStatus, 
  toggleTaskStatus, 
  handleEdit, 
  handleDelete, 
  getPriorityIcon, 
  getPriorityColor 
}) => {
  if (filteredTasks.length === 0) {
    return (
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
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {filteredTasks.map((task, index) => {
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
        })}
      </AnimatePresence>
    </div>
  )
}

export default TaskList
