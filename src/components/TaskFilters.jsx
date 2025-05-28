import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

const TaskFilters = ({ 
  categories, 
  tasks, 
  selectedCategory, 
  setSelectedCategory, 
  selectedStatus, 
  setSelectedStatus 
}) => {
  return (
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
  )
}

export default TaskFilters
