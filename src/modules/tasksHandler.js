import Task from './task';
import { compareAsc, format, parse } from 'date-fns';

const TasksHandler = (function () {
    let filter = 'incoming';

    const addTask = (obj) => {
        const newTask = new Task(obj);
        let tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const deleteTask = (id) => {
        let tasks = JSON.parse(localStorage.tasks);
        tasks = tasks.filter((element) => element.id != id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const getTask = (id) => {
        return JSON.parse(localStorage.tasks).filter((element) => element.id == id)[0];
    };

    const changeFilter = (newFilter) => {
        filter = newFilter;
    };

    const getFilter = () => {
        return filter;
    };

    const getStorage = () => {
        const copyOfTasks = localStorage.tasks ? [...JSON.parse(localStorage.tasks)] : [];

        copyOfTasks.sort((a, b) => {
            return compareAsc(
                parse(a.dueDate, 'dd-MM-yyyy', new Date()),
                parse(b.dueDate, 'dd-MM-yyyy', new Date())
            );
        });

        if (filter === 'incoming') {
            return copyOfTasks;
        } else if (filter === 'today') {
            const todayTasks = copyOfTasks.filter(
                (element) => element.dueDate === format(new Date(), 'dd-MM-yyyy')
            );

            return todayTasks;
        } else {
            const returnTasks = copyOfTasks.filter((element) => {
                return element.projectId == filter;
            });
            return returnTasks;
        }
    };

    return { addTask, getTask, deleteTask, getStorage, changeFilter, getFilter };
})();

export default TasksHandler;
