// Task Controller - Presentation Layer
(function () {
  "use strict";

  angular.module("taskApp").controller("TaskController", TaskController);

  TaskController.$inject = ["TaskService", "TaskService2"];

  function TaskController(TaskService, TaskService2) {
    var vm = this;

    // Bindable properties
    vm.tasks = [];
    vm.users = [];
    vm.categories = [];
    vm.newTask = {};
    vm.searchText = "";
    vm.showCompleted = true;
    vm.priorityFilter = "";
    vm.sortBy = "-createdAt";

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
      loadUsers();
      loadCategories();
      resetForm();
    }

    function loadTasks() {
      // AngularJS
      // vm.tasks = TaskService.getAllTasks();

      // Angular 14
      TaskService2.getAllTasks().subscribe({
        next: function (tasks) {
            console.log('categories', tasks);
          vm.tasks = tasks.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        },
        error: function (error) {
          console.error("Failed to load tasks.", error);
        },
      });
    }

    function loadUsers() {
      TaskService2.getUsers().subscribe({
        next: function (users) {
          vm.users = users;
        },
        error: function (error) {
          console.error("Failed to load users.", error);
        },
      });
    }

    function loadCategories() {
      TaskService2.getCategories().subscribe({
        next: function (categories) {
          vm.categories = categories;
          console.log('categories', categories);
        },
        error: function (error) {
          console.error("Failed to load users.", error);
        },
      });
    }

    function addTask() {
      // AngularJS
      // if (vm.newTask.title && vm.newTask.title.trim()) {
      //     TaskService.addTask(vm.newTask);
      //     loadTasks();
      //     resetForm();
      // }

      // Angular 14
      if (vm.newTask.title && vm.newTask.title.trim()) {
        TaskService2.addTask(vm.newTask).subscribe({
          next: function (addedTask) {
            console.log("Task added: ", addedTask);
            loadTasks();
            loadUsers();
            loadCategories();
            resetForm();
          },
          error: function (error) {
            console.error("Failed to add task:", error);
          },
        });
      }
    }

    function deleteTask(taskId) {
      // AngularJS
      // if (confirm('Are you sure you want to delete this task?')) {
      //     TaskService.deleteTask(taskId);
      //     loadTasks();
      // }

      // Angular 14
      if (confirm("Are you sure you want to delete this task?")) {
        TaskService2.deleteTask(taskId).subscribe({
          next: function () {
            console.log("Task deleted:", taskId);
            loadTasks();
            loadUsers();
            loadCategories();
          },
          error: function (error) {
            console.error("Failed to delete task:", error);
          },
        });
      }
    }

    function toggleTask(taskId) {
      // AngularJS
      //   TaskService.toggleTaskComplete(taskId);
      //   loadTasks();

      // Angular 14
      TaskService2.getTaskByIdHttp(taskId).subscribe({
        next: function (task) {
          TaskService2.toggleTaskComplete(task).subscribe({
            next: function (completedTask) {
              console.log("Task completed: ", completedTask);
              loadTasks();
              loadUsers();
              loadCategories();
            },
          });
        },
        error: function (error) {
          console.log("Failed to fetch task.", error);
        },
      });
    }

    function getFilteredTasks() {
      var filtered = vm.tasks;

      // Apply search filter using lodash
      if (vm.searchText) {
        filtered = _.filter(filtered, function (task) {
          var searchLower = vm.searchText.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
          );
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
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date(),
      };
    }

    function getTaskStats() {
      //   return TaskService.getTaskStats();
      return TaskService2.getTaskStats().subscribe({
        next: function (stats) {
          vm.taskStats = stats;
        },
        error: function (error) {
          console.error("Failed to fetch task:", error);
        },
      });
    }

    // Utility methods for demonstration of lodash/underscore
    vm.groupTasksByPriority = function () {
      return _.groupBy(vm.tasks, "priority");
    };

    vm.getHighPriorityTasks = function () {
      return _.filter(vm.tasks, { priority: "high" });
    };

    vm.sortTasksByDate = function () {
      return _.sortBy(vm.tasks, "createdAt");
    };

    vm.getTasksWithinDays = function (days) {
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);

      return _.filter(vm.tasks, function (task) {
        return new Date(task.dueDate) <= targetDate && !task.completed;
      });
    };
  }
})();
