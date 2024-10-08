import "./style.css";

import { format, parse } from "date-fns";
import TasksHandler from "./modules/tasksHandler";
import ProjectsHandler from "./modules/projectsHandler";

import GridSvg from "./imgs/grid-stroke-rounded.svg";
import EditSvg from "./imgs/pencil-edit-02-stroke-rounded.svg";
import XMarkSvg from "./imgs/cancel-01-stroke-rounded.svg";
import TrashCanSvg from "./imgs/delete-02-stroke-rounded.svg";

const DOM = (function () {
    // Main content
    const tasks = document.querySelector(".main__tasks");
    const taskWindow = document.querySelector(".task");
    const mainInfo = document.querySelector(".main__info");
    const mainTitle = mainInfo.querySelector("h3");
    const mainNumberOfTasks = mainInfo.querySelector("p");

    // Task window
    const addTaskButton = document.querySelectorAll("#add-task");
    const addTaskWindow = document.querySelector(".add-task");
    const overlay = document.querySelector(".overlay");
    const exitWindow = document.querySelectorAll(".task__exit");
    const addTaskForm = document.querySelector(".add-task__form");
    const projectSelect = addTaskForm.querySelector(".add-task__projects");

    // Edit Task window
    const editTaskWindow = document.querySelector(".edit-task");
    const editTaskForm = document.querySelector(".edit-task__form");

    // Aside
    const asideFilters = document.querySelectorAll(".aside__filter");

    // Projects
    const addProjectButton = document.querySelector(".aside__add-project");
    const addProjectWindow = document.querySelector(".add-project");
    const addProjectForm = document.querySelector(".add-project__form");
    const projectsContent = document.querySelector(".projects");

    // ------------------------- MAIN ----------------------------------------
    // Open Task
    tasks.addEventListener("click", (e) => {
        const currentTaskId = e.target.closest(".main__task").getAttribute("data-id");

        if (e.target.classList.contains("trash-can")) {
            TasksHandler.deleteTask(currentTaskId);
            updateTasks();
        } else if (e.target.classList.contains("task__circle")) {
            TasksHandler.completeTask(currentTaskId);
            updateTasks();
        } else if (e.target.classList.contains("edit-icon")) {
            editTask(currentTaskId);
        } else {
            const currentTask = TasksHandler.getTask(currentTaskId);
            showTask(currentTask);
        }
    });

    // ------------------------- TASK ----------------------------------------
    addTaskButton.forEach((element) => {
        element.addEventListener("click", () => showWindow(addTaskWindow));
    });

    addTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const values = getFormValues(addTaskForm);
        TasksHandler.addTask(values);
        updateTasks();
        closeWindow(addTaskWindow);
        addTaskForm.reset();
    });

    taskWindow.addEventListener("click", (e) => {
        if (e.target.classList.contains("task__exit")) {
            closeWindowByX(e.target);
        }
    });

    editTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const values = getFormValues(editTaskForm);
        const taskId = e.target.querySelector("label[data-id]").getAttribute("data-id");
        TasksHandler.editTask(values, taskId);
        updateTasks();
        closeWindow(editTaskWindow);
        editTaskForm.reset();
    });

    editTaskWindow.addEventListener("click", (e) => {
        if (e.target.classList.contains("task__exit")) {
            closeWindowByX(e.target);
        }
    });

    // ------------------------- ASIDE ---------------------------------------
    asideFilters.forEach((element) => {
        element.addEventListener("click", () => {
            const currentProject = element.querySelector(".tab__text").textContent;

            TasksHandler.changeProject(currentProject.toLowerCase());

            mainTitle.textContent = currentProject;

            ProjectsHandler.editSelectedProject("none");

            updateProjects();
            updateTasks();
        });
    });

    // ------------------------- PROJECT -------------------------------------
    projectsContent.addEventListener("click", (e) => {
        const currentProjectId = e.target.closest(".project").getAttribute("data-id");
        const currentProjectName = e.target.closest(".project").textContent;

        if (e.target.classList.contains("trash-can")) {
            ProjectsHandler.deleteProject(currentProjectId);
            if (TasksHandler.getProject() == currentProjectId) {
                TasksHandler.changeProject("incoming");
                mainTitle.textContent = "Incoming";
            }
        } else {
            TasksHandler.changeProject(currentProjectId);
            ProjectsHandler.editSelectedProject(currentProjectId);
            mainTitle.textContent = currentProjectName;
        }
        updateTasks();
        updateProjects();
    });

    addProjectButton.addEventListener("click", () => showWindow(addProjectWindow));

    addProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newProjectTitle = addProjectForm.querySelector("input").value;
        ProjectsHandler.addProject({ title: newProjectTitle, id: new Date().getTime() });
        updateProjects();
        closeWindow(addProjectWindow);
        addProjectForm.reset();
    });
    // ------------------------- OTHER ---------------------------------------
    exitWindow.forEach((element) => {
        element.addEventListener("click", () => closeWindowByX(element));
    });

    // ------------------------- FUNCTIONS -----------------------------------
    const getFormValues = (form) => {
        const values = {};
        const formInputs = form.querySelectorAll("input");
        const formSelects = form.querySelectorAll("select");

        formInputs.forEach((element) => {
            values[element.name] = element.value;
        });

        formSelects.forEach((element) => {
            if (element.name === "project") {
                values.projectId = element.value;
                values.project = element.querySelector(`[value="${element.value}"]`).textContent;
            } else {
                values[element.name] = element.value;
            }
        });

        if (values["dueDate"] === "") values["dueDate"] = new Date();

        values["dueDate"] = format(values["dueDate"], "dd-MM-yyyy");
        values["id"] = new Date().getTime();

        return values;
    };

    const showWindow = (window) => {
        window.classList.remove("hidden");
        overlay.classList.remove("hidden");
    };

    const closeWindow = (window) => {
        window.classList.add("hidden");
        overlay.classList.add("hidden");
    };

    const closeWindowByX = (window) => {
        window.parentElement.classList.add("hidden");
        overlay.classList.add("hidden");
    };

    const editTask = (id) => {
        const task = TasksHandler.getTask(id);
        const parsedDate = parse(task.dueDate, "dd-MM-yyyy", new Date());
        const taskDate = format(parsedDate, "yyyy-MM-dd");

        editTaskForm.innerHTML = `
                <div>
                    <label for="title" data-id="${id}">Title:</label>
                    <input type="text" id="title" name="title" value=${task.title} required />
                </div>
                <div>
                    <label for="description">Description:</label>
                    <input type="text" id="description" name="description" value="${task.description}" />
                </div>
                <div class="add-task__option">
                    <label for="dueDate">Due Date:</label>
                    <input type="date" id="dueDate" name="dueDate" value=${taskDate} />
                </div>
                <div class="add-task__option">
                    <label for="priority">Priority:</label>
                    <select name="priority" id="priority">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div class="add-task__option">
                    <label for="project">Project:</label>
                    <select class="add-task__projects" name="project" id="project">
                        ${projectSelect.innerHTML}
                    </select>
                </div>
                <button>Edit Task</button>`;

        showWindow(editTaskWindow);
    };

    const updateTasks = () => {
        const tasksStorage = TasksHandler.getStorage();
        tasks.innerHTML = ``;
        let count = 0;

        for (const value of tasksStorage.values()) {
            if (!value.completed) count++;
            const newTaskHTML = `
                <div class="main__task" data-id=${value.id}>
                    <div> 
                        <div class="task__circle"></div>
                        <div class="project__text tab__text">${value.title}</div>
                    </div>
                    <div class="main__details">
                        <img class="edit-icon" src=${EditSvg} alt="Edit icon"/>
                        <img class="trash-can" src="${TrashCanSvg}" alt="Trash Can" />
                    </div>
                    <div class="strike ${value.completed ? "" : "hidden"}"></div>
                </div>`;

            tasks.innerHTML += newTaskHTML;
        }

        mainNumberOfTasks.textContent = `${count} tasks`;
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
        projectSelect.innerHTML = `<option class="option-incoming" value="incoming">Incoming</option>`;

        for (const element of projects.values()) {
            const newProjectHTML = `
                    <div class="project" data-id="${element.id}">
                        <div> 
                            <img src="${GridSvg}" alt="Grid" />
                            <div class="project__text tab__text">${element.title}</div>
                        </div>
                        <div>
                            <img class="trash-can" src="${TrashCanSvg}" alt="Trash Can" />
                        </div>
                    </div>`;

            const newProjectOption = `<option value="${element.id}" ${
                element.selected ? "selected" : ""
            }>${element.title}</option>`;

            projectsContent.innerHTML += newProjectHTML;
            projectSelect.innerHTML += newProjectOption;
        }
    };

    updateTasks();
    updateProjects();
})();
