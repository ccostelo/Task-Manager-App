// Task Service - Data Layer
(function() {
    'use strict';
    
    angular.module('taskApp')
    .service('TaskService', TaskService);
    
    TaskService.$inject = [];
    
    function TaskService() {
        var vm = this;
        
        // Private variables
        var tasks = [];
        var nextId = 1;
        
        // Public API
        vm.getAllTasks = getAllTasks;
        vm.getTaskById = getTaskById;
        vm.addTask = addTask;
        vm.updateTask = updateTask;
        vm.deleteTask = deleteTask;
        vm.toggleTaskComplete = toggleTaskComplete;
        vm.getCompletedTasks = getCompletedTasks;
        vm.getPendingTasks = getPendingTasks;
        vm.getTasksByPriority = getTasksByPriority;
        vm.searchTasks = searchTasks;
        vm.loadSampleData = loadSampleData;
        vm.getTaskStats = getTaskStats;
        
        // Initialize with sample data
        loadSampleData();
        
        // Service Methods
        function getAllTasks() {
            return angular.copy(tasks);
        }
        
        function getTaskById(id) {
            return _.find(tasks, { id: id });
        }
        
        function addTask(taskData) {
            var newTask = {
                id: nextId++,
                title: taskData.title,
                description: taskData.description || '',
                priority: taskData.priority || 'medium',
                completed: false,
                createdAt: new Date(),
                dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date()
            };
            
            tasks.push(newTask);
            return angular.copy(newTask);
        }
        
        function updateTask(id, updates) {
            var task = getTaskById(id);
            if (task) {
                _.merge(task, updates);
                task.updatedAt = new Date();
                return angular.copy(task);
            }
            return null;
        }
        
        function deleteTask(id) {
            var index = _.findIndex(tasks, { id: id });
            if (index !== -1) {
                return tasks.splice(index, 1)[0];
            }
            return null;
        }
        
        function toggleTaskComplete(id) {
            var task = getTaskById(id);
            if (task) {
                task.completed = !task.completed;
                task.completedAt = task.completed ? new Date() : null;
                return angular.copy(task);
            }
            return null;
        }
        
        function getCompletedTasks() {
            return _.filter(tasks, { completed: true });
        }
        
        function getPendingTasks() {
            return _.filter(tasks, { completed: false });
        }
        
        function getTasksByPriority(priority) {
            return _.filter(tasks, { priority: priority });
        }
        
        function searchTasks(searchTerm) {
            if (!searchTerm) return getAllTasks();
            
            var lowerSearchTerm = searchTerm.toLowerCase();
            return _.filter(tasks, function(task) {
                return task.title.toLowerCase().includes(lowerSearchTerm) ||
                       task.description.toLowerCase().includes(lowerSearchTerm);
            });
        }
        
        function getTaskStats() {
            var stats = {
                total: tasks.length,
                completed: getCompletedTasks().length,
                pending: getPendingTasks().length,
                high: getTasksByPriority('high').length,
                medium: getTasksByPriority('medium').length,
                low: getTasksByPriority('low').length
            };
            
            stats.completionRate = stats.total > 0 ? 
                Math.round((stats.completed / stats.total) * 100) : 0;
                
            return stats;
        }
        
        function loadSampleData() {
            var sampleTasks = [
                {
                    title: "Complete AngularJS Project",
                    description: "Finish the task management application with MVC structure",
                    priority: "high",
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                },
                {
                    title: "Study Angular 14 Migration",
                    description: "Research best practices for migrating from AngularJS to Angular 14",
                    priority: "medium",
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
                },
                {
                    title: "Setup Development Environment",
                    description: "Install Node.js, Angular CLI, and other necessary tools",
                    priority: "low",
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
                }
            ];
            
            // Use underscore.js each function
            _.each(sampleTasks, function(taskData) {
                addTask(taskData);
            });
        }
    }
})();