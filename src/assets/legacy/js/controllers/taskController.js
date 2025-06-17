// Task Controller - Presentation Layer
(function() {
    'use strict';
    
    angular.module('taskApp')
    .controller('TaskController', TaskController);
    
    TaskController.$inject = ['TaskService'];
    
    function TaskController(TaskService) {
        var vm = this;
        
        // Bindable properties
        vm.tasks = [];
        vm.newTask = {};
        vm.searchText = '';
        vm.showCompleted = true;
        vm.priorityFilter = '';
        vm.sortBy = '-createdAt';
        
        // Bindable methods
        vm.addTask = addTask;
        vm.deleteTask = deleteTask;
        vm.toggleTask = toggleTask;
        vm.getFilteredTasks = getFilteredTasks;
        vm.getCompletedCount = getCompletedCount;
        vm.resetForm = resetForm;
        vm.getTaskStats = getTaskStats;
        
        // Initialize
        activate();
        
        // Controller Methods
        function activate() {
            loadTasks();
            resetForm();
        }
        
        function loadTasks() {
            vm.tasks = TaskService.getAllTasks();
        }
        
        function addTask() {
            if (vm.newTask.title && vm.newTask.title.trim()) {
                TaskService.addTask(vm.newTask);
                loadTasks();
                resetForm();
            }
        }
        
        function deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                TaskService.deleteTask(taskId);
                loadTasks();
            }
        }
        
        function toggleTask(taskId) {
            TaskService.toggleTaskComplete(taskId);
            loadTasks();
        }
        
        function getFilteredTasks() {
            var filtered = vm.tasks;
            
            // Apply search filter using lodash
            if (vm.searchText) {
                filtered = _.filter(filtered, function(task) {
                    var searchLower = vm.searchText.toLowerCase();
                    return task.title.toLowerCase().includes(searchLower) ||
                           task.description.toLowerCase().includes(searchLower);
                });
            }
            
            // Apply priority filter using underscore
            if (vm.priorityFilter) {
                filtered = _.where(filtered, { priority: vm.priorityFilter });
            }
            
            // Apply completion filter
            if (!vm.showCompleted) {
                filtered = _.reject(filtered, { completed: true });
            }
            
            return filtered;
        }
        
        function getCompletedCount() {
            return _.where(vm.getFilteredTasks(), { completed: true }).length;
        }
        
        function resetForm() {
            vm.newTask = {
                title: '',
                description: '',
                priority: 'medium',
                dueDate: new Date()
            };
        }
        
        function getTaskStats() {
            return TaskService.getTaskStats();
        }
        
        // Utility methods for demonstration of lodash/underscore
        vm.groupTasksByPriority = function() {
            return _.groupBy(vm.tasks, 'priority');
        };
        
        vm.getHighPriorityTasks = function() {
            return _.filter(vm.tasks, { priority: 'high' });
        };
        
        vm.sortTasksByDate = function() {
            return _.sortBy(vm.tasks, 'createdAt');
        };
        
        vm.getTasksWithinDays = function(days) {
            var targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + days);
            
            return _.filter(vm.tasks, function(task) {
                return new Date(task.dueDate) <= targetDate && !task.completed;
            });
        };
    }
})();