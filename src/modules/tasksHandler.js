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

    const deleteTask = (index) => {
        // ADD FUNCTION
    };

    const getTask = (id) => {
        return JSON.parse(localStorage.tasks).filter((element) => element.id == id)[0];
    };

    const changeFilter = (newFilter) => {
        filter = newFilter;
    };

    const getStorage = () => {
        const copyOfTasks = localStorage.tasks ? [...JSON.parse(localStorage.tasks)] : [];

        copyOfTasks.sort((a, b) => {
            return compareAsc(
                parse(a.dueDate, 'dd-MM-yyyy', new Date()),
                parse(b.dueDate, 'dd-MM-yyyy', new Date())
            );
        });

        if (filter === 'today') {
            const todayTasks = copyOfTasks.filter(
                (element) => element.dueDate === format(new Date(), 'dd-MM-yyyy')
            );

            return todayTasks;
        }

        return copyOfTasks;
    };

    return { addTask, getTask, deleteTask, getStorage, changeFilter };
})();

export default TasksHandler;
