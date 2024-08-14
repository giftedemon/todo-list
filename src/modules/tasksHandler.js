import Task from "./task";
import { compareAsc, format, parse } from "date-fns";

const TasksHandler = (function () {
    let project = "incoming";

    const addTask = (obj) => {
        const newTask = new Task(obj);
        let tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const deleteProjectTasks = (projectId) => {
        let tasks = JSON.parse(localStorage.tasks);
        tasks = tasks.filter((element) => element.projectId != projectId);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const deleteTask = (id) => {
        let tasks = JSON.parse(localStorage.tasks);
        tasks = tasks.filter((element) => element.id != id);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const editTask = (obj, id) => {
        deleteTask(id);
        addTask(obj);
    };

    const getTask = (id) => {
        return JSON.parse(localStorage.tasks).filter((element) => element.id == id)[0];
    };

    const changeProject = (newProject) => {
        project = newProject;
    };

    const getProject = () => {
        return project;
    };

    const getStorage = () => {
        let copyOfTasks = localStorage.tasks ? [...JSON.parse(localStorage.tasks)] : [];

        copyOfTasks.sort((a, b) => {
            return compareAsc(
                parse(a.dueDate, "dd-MM-yyyy", new Date()),
                parse(b.dueDate, "dd-MM-yyyy", new Date())
            );
        });

        if (project === "incoming") {
        } else if (project === "today") {
            copyOfTasks = copyOfTasks.filter(
                (element) => element.dueDate === format(new Date(), "dd-MM-yyyy")
            );
        } else {
            copyOfTasks = copyOfTasks.filter((element) => {
                return element.projectId == project;
            });
        }

        copyOfTasks.sort((a, b) => {
            if (a.completed === b.completed) {
                return 0;
            } else if (a.completed) {
                return 1;
            } else {
                return -1;
            }
        });

        return copyOfTasks;
    };

    const completeTask = (id) => {
        let tasks = JSON.parse(localStorage.tasks);
        tasks.map((element) => {
            if (element.id == id) {
                element.completed === true
                    ? (element.completed = false)
                    : (element.completed = true);
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    return {
        addTask,
        getTask,
        deleteTask,
        getStorage,
        changeProject,
        getProject,
        deleteProjectTasks,
        completeTask,
        editTask,
    };
})();

export default TasksHandler;
