import { CategoryModel, TaskModel, UserModel } from '../services/task.service';
import { ActionTypes } from './task.store';


export interface Action{
    type: ActionTypes;
    payload?: any;
}

export interface AppState {
    tasks: TaskModel[];
    users: UserModel[];
    categories: CategoryModel[];
}

export declare const store: {
    getState(): AppState;
    dispatch(action: any): void;
    subscribe(listener: () => void): () => void;
}

export declare const addTask: (task: TaskModel) => any;
export declare const updateTask: (task: TaskModel) => any;
export declare const deleteTask: (id: number) => any;
export declare const setTasks: (tasks: TaskModel[]) => any;
export declare const setUsers: (users: UserModel[]) => any;
export declare const setCategories: (categories: CategoryModel[]) => any;