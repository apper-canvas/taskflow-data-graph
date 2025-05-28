import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const TaskForm = ({ 
  showTaskForm, 
  setShowTaskForm, 
  editingTask, 
  taskForm, 
  setTaskForm, 
  categories, 
  handleSubmit 
}) => {
  if (!showTaskForm) return null

  return (
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
  )
}

export default TaskForm
