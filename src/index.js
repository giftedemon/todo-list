import './style.css';

import { compareAsc, format, parseISO } from 'date-fns';
import TasksHandler from './modules/tasksHandler';
import ProjectsHandler from './modules/projectsHandler';

import GridSvg from './imgs/grid-stroke-rounded.svg';
import CircleSvg from './imgs/circle-stroke-rounded.svg';
import XMarkSvg from './imgs/cancel-01-stroke-rounded.svg';

const DOM = (function () {
    // Main content
    const tasks = document.querySelector('.main__tasks');
    const taskWindow = document.querySelector('.task');

    // Task window
    const addTaskButton = document.querySelectorAll('#add-task');
    const addTaskWindow = document.querySelector('.add-task');
    const overlay = document.querySelector('.overlay');
    const exitWindow = document.querySelectorAll('.task__exit');
    const addTaskForm = document.querySelector('.add-task__form');

    // Aside
    const asideFilters = document.querySelectorAll('.aside__filter');

    // Projects
    const addProjectButton = document.querySelector('.aside__add-project');
    const addProjectWindow = document.querySelector('.add-project');
    const addProjectForm = document.querySelector('.add-project__form');
    const projectsContent = document.querySelector('.projects');

    // ------------------------- MAIN ----------------------------------------
    // Open Task
    tasks.addEventListener('click', (e) => {
        const currentTaskIndex = e.target.closest('.main__task').getAttribute('data-index');
        const currentTask = TasksHandler.getTask(currentTaskIndex);
        showTask(currentTask);
    });

    // ------------------------- TASK ----------------------------------------
    addTaskButton.forEach((element) => {
        element.addEventListener('click', () => showWindow(addTaskWindow));
    });

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const values = getFormValues(addTaskForm);
        TasksHandler.addTask(values);
        updateTasks();
        closeWindow(addTaskWindow);
        addTaskForm.reset();
    });

    taskWindow.addEventListener('click', (e) => {
        if (e.target.classList.contains('task__exit')) {
            closeWindowByX(e.target);
        }
    });

    // ------------------------- ASIDE ---------------------------------------
    asideFilters.forEach((element) => {
        element.addEventListener('click', () => {
            TasksHandler.changeFilter(
                element.querySelector('.tab__text').textContent.toLowerCase()
            );

            updateTasks();
        });
    });

    // ------------------------- PROJECT -------------------------------------
    addProjectButton.addEventListener('click', () => showWindow(addProjectWindow));

    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProjectTitle = addProjectForm.querySelector('input').value;
        ProjectsHandler.addProject({ title: newProjectTitle, id: new Date().getTime() });
        updateProjects();
        closeWindow(addProjectWindow);
        addProjectForm.reset();
    });
    // ------------------------- OTHER ---------------------------------------
    exitWindow.forEach((element) => {
        element.addEventListener('click', () => closeWindowByX(element));
    });

    // ------------------------- FUNCTIONS -----------------------------------
    const getFormValues = (form) => {
        const values = {};
        const formInputs = form.querySelectorAll('input');
        const formSelects = form.querySelectorAll('select');

        formInputs.forEach((element) => {
            values[element.name] = element.value;
        });

        formSelects.forEach((element) => {
            values[element.name] = element.value;
        });

        if (values['dueDate'] === '') {
            values['dueDate'] = new Date();
        }

        values['dueDate'] = format(values['dueDate'], 'dd-MM-yyyy');
        values['id'] = new Date().getTime();

        return values;
    };

    const showWindow = (window) => {
        window.classList.remove('hidden');
        overlay.classList.remove('hidden');
    };

    const closeWindow = (window) => {
        window.classList.add('hidden');
        overlay.classList.add('hidden');
    };

    const closeWindowByX = (window) => {
        window.parentElement.classList.add('hidden');
        overlay.classList.add('hidden');
    };

    const updateTasks = () => {
        const tasksStorage = TasksHandler.getStorage();
        tasks.innerHTML = ``;

        for (const value of tasksStorage.values()) {
            const newTaskHTML = `
                <div class="main__task" data-index=${value.id}>
                    <img src="${CircleSvg}" alt="Circle" />
                    <div class="project__text tab__text">${value.title}</div>
                </div>`;

            tasks.innerHTML += newTaskHTML;
        }
    };

    const showTask = (element) => {
        taskWindow.innerHTML = `
            <h3 class="task__name">${element.title}</h3>
            <img class="task__exit" src="${XMarkSvg}" alt="X mark" />
            <p class="task__description">${element.description}</p>
            <div class="task__details">
                <span class="task__due-date">${element.dueDate}</span>
                <span class="task__priority">${element.priority} priority</span>
                <span class="task__project">${element.project}</span>
            </div>`;

        showWindow(taskWindow);
    };

    const updateProjects = () => {
        const projects = ProjectsHandler.getProjects();
        projectsContent.innerHTML = ``;

        for (const element of projects.values()) {
            const newProjectHTML = `
                    <div class="project aside__tab">
                        <img src="${GridSvg}" alt="Grid" />
                        <div class="project__text tab__text" data-id="${element.id}">${element.title}</div>
                    </div>`;

            projectsContent.innerHTML += newProjectHTML;
        }
    };

    updateTasks();
    updateProjects();
})();
