import { Action, AppState } from './task.store.d';
import { createStore } from 'redux';
import { CategoryModel, TaskModel, UserModel } from '../services/task.service';

export enum ActionTypes {
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  SET_TASKS = 'SET_TASKS',
  SET_USERS = 'SET_USERS',
  SET_CATEGORIES = 'SET_CATEGORIES',
}

const initialState: AppState = {
  tasks: [],
  users: [],
  categories: [],
};

// Action Creators
export const addTask = (task: TaskModel) => ({
  type: ActionTypes.ADD_TASK,
  payload: task,
});
export const updateTask = (task: TaskModel) => ({
  type: ActionTypes.UPDATE_TASK,
  payload: task,
});
export const deleteTask = (id: number) => ({
  type: ActionTypes.DELETE_TASK,
  payload: id,
});
export const setTasks = (tasks: TaskModel[]) => ({
  type: ActionTypes.SET_TASKS,
  payload: tasks,
});
export const setUsers = (users: UserModel[]) => ({
  type: ActionTypes.SET_USERS,
  payload: users,
});
export const setCategories = (categories: CategoryModel[]) => ({
  type: ActionTypes.SET_CATEGORIES,
  payload: categories,
});

const tasksReducer = (
  state = initialState,
  action: Action
): typeof initialState => {
  switch (action.type) {
    case ActionTypes.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case ActionTypes.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case ActionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case ActionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create store
export const store = createStore(tasksReducer);
